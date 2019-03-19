'use strict';

/* Import WebpackApp */
import '../../src/track-box/src/track-box.js';

let shadowDOMTemplate = document.createElement('template');
shadowDOMTemplate.innerHTML = `
  <style>
    :host {
      display: inline-flex;
    }
    track-box {
      display: inline-flex;
    }
  </style>
  <track-box id="track">
    <canvas id="paint"></canvas>
  </track-box>
`;

const DEFAULT_OPTIONS = {
  height: 300,
  width: 400,
  background: 'rgba(255,255,255,0)',
  drawOptions: {
    strokeWidth: 1,
    strokeStyle: 'red'
  },
  maxHistoryLength: 10,
  actionHandler: {
    brush: {
      onStart: function(e) {
        const context = this.context;
        const {x, y} = e.detail;
        context.beginPath();
        context.moveTo(x, y);
        this.paintArea.style.cursor = 'none'
      },
      onTrack: function(e) {
        const context = this.context;
        const {x, y, dy, dx, ddx, ddy} = e.detail;
        context.arcTo(x, y, x - ddx, y - ddy, 1);
        context.stroke();
      },
      onEnd: function(e) {
        const context = this.context;
        this.paintArea.style.cursor = ''
        this.actionHandler.brush.onTrack.call(this, e);
        context.closePath();
      }
    },
    circle: {
      onStart: function(e) {
        this.paintArea.style.cursor = 'none';
      },
      onTrack: function(e) {
        this.undo();
        const context = this.context;
        const {x, y, dy, dx} = e.detail;
        context.beginPath();
        context.arc(x-dx, y-dy, Math.sqrt(dy*dy + dx*dx), 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
      },
      onEnd: function(e) {
        this.paintArea.style.cursor = ''
        this.actionHandler.circle.onTrack.call(this, e);
      }
    },
    line: {
      onStart: function(e) {
        this.paintArea.style.cursor = 'none';
      },
      onTrack: function(e) {
        this.undo();
        const context = this.context;
        const {x, y, dy, dx} = e.detail;
        context.beginPath();
        context.moveTo(x-dx, y-dy);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
      },
      onEnd: function(e) {
        this.paintArea.style.cursor = ''
        this.actionHandler.line.onTrack.call(this, e);
      }
    },
    rect: {
      onStart: function(e) {
        this.paintArea.style.cursor = 'none';
      },
      onTrack: function(e) {
        this.undo();
        const context = this.context;
        const {x, y, dy, dx} = e.detail;
        context.beginPath();
        context.moveTo(x-dx, y-dy);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
      },
      onEnd: function(e) {
        this.paintArea.style.cursor = ''
        this.actionHandler.line.onTrack.call(this, e);
      }
    }
  }
}

class PaintBox extends HTMLElement {
  constructor(options) {
    super();
    // default properties
    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(shadowDOMTemplate.content.cloneNode(true));
    this.paintArea = this.shadowRoot.querySelector('#paint');
    this.context = this.paintArea.getContext('2d');
    this._onTrack = this._onTrack.bind(this);
    this.history = [];
    this._addEventListeners();
    Object.assign(this, DEFAULT_OPTIONS);
    Object.assign(this, options);
    this.action = this.action || this.getAttribute('action');
    this.storeToHistory()
  }

  static get observedAttributes() {
    return ['height', 'width', 'background', 'action'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  set action(ac) {
    if (this.actionHandler.hasOwnProperty(ac)) {
      this._action = ac;
    } else {
      // fallback
      this._action = ac = Object.keys(this.actionHandler)[0];
    }

    this.setAttribute('action', ac);
    this._activeActionHandler = this.actionHandler[ac];
  }

  get action() {
    return this._action;
  }

  get width() {
    return this._width;
  }

  set width(w) {
    this._width = +w;
    this.paintArea.setAttribute('width', w);
  }

  get height() {
    return this._height;
  }

  set height(h) {
    this._height = +h;
    this.paintArea.setAttribute('height', h);
  }

  get background() {
    return this._background;
  }

  set background(b) {
    this._background = b;
    this.clearPaintArea();
  }

  disconnectedCallback() {
    this._removeEventListeners();
    this.history.length = 0;
  }

  _addEventListeners() {
    this.paintArea.addEventListener('track', this._onTrack);
    this.addEventListener('contextmenu', this.clearPaintArea);
  }

  _removeEventListeners() {
    this.paintArea.removeEventListener('track', this._onTrack);
    this.removeEventListener('contextmenu', this.clearPaintArea);
  }

  _onTrack(e) {
    switch (e.detail.state) {
      case 'start':
        this._activeActionHandler.onStart.call(this, e, this.drawOptions)
        break;
      case 'track':
        this._activeActionHandler.onTrack.call(this, e, this.drawOptions);
        break;
      case 'end':
        this._activeActionHandler.onEnd.call(this, e, this.drawOptions);
        this.storeToHistory()
        break;
    }
  }

  storeToHistory() {
    const canvas = this.paintArea;
    const context = this.context;
    this.history.push(context.getImageData(0, 0, canvas.width, canvas.height));
    while (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }
    console.log(this.history);

  }

  undo() {
    if (this.history.length > 0) {
      const context = this.context;
      const lastHistoryIndex = this.history.length - 1;
      context.putImageData(this.history[lastHistoryIndex], 0, 0);
    }
  }


  clearPaintArea(e) {
    e && e.preventDefault();
    const canvas = this.paintArea;
    const context = this.context;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = this.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
  }
};

customElements.define('paint-box', PaintBox);

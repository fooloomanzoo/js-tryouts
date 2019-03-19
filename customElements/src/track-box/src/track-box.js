"use-strict"

const MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];

/**
 * @param {string} name Possible mouse event name
 * @return {boolean} true if mouse event, false if not
 */
function isMouseEvent(name) {
  return MOUSE_EVENTS.indexOf(name) > -1;
}

function computeEventTransform(e, autoOffset) {
  const initialTarget = e.composedPath()[0];
  if (isMouseEvent(e.type)) {
    // only left button
    if (e.button === 0) {
      // for mouse events
      if (autoOffset) {
        // offset transform to the current target node
        return e => {
          return {
            x: e.clientX - initialTarget.offsetLeft,
            y: e.clientY - initialTarget.offsetTop
          }
        }
      }
      return e => {
        // only left button
        if (e.button === 0) {
          return {
            x: e.clientX,
            y: e.clientY
          }
        }
      }
    }
    return null;
  }
  // else handling touch events and only first finger
  if (e.touches.length === 1) {
    if (autoOffset) {
      // offset transform to the current target node
      return e => {
        const t = e.changedTouches[0];
        return {x: t.clientX - initialTarget.offsetLeft, y: t.clientY - initialTarget.offsetTop}
      }
    }
    return e => {
      const t = e.changedTouches[0];
      return {
        x: t.clientX,
        y: t.clientY
      }
    }
  }
  return null;
}

const DEFAULT_OPTIONS = {
  autoOffset: true,
  maxlength: undefined,
  dispatchEventOptions: { bubbles: true, cancelable: true, composed: true },
  eventListenerOptions: { passive: true }
}

export class TrackBox extends HTMLElement {
  constructor(options) {
    super();
    Object.assign(this, DEFAULT_OPTIONS);
    Object.assign(this, options);
    this._trackQueue = [];
    this._onStart = this._onStart.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._addStartListener();
  }

  get detail() {
    const lastIndex = this._trackQueue.length - 1;
    const lastInfo = this._trackQueue[lastIndex];
    if (!lastInfo) return {};
    let detail = {
      state: lastInfo.state,
      x: lastInfo.x,
      y: lastInfo.y,
      dx: 0,
      dy: 0,
      ddx: 0,
      ddy: 0,
      record: this._trackQueue
    };
    if (lastIndex > 1) {
      const firstInfo = this._first;
      const previousInfo = this._trackQueue[lastIndex - 1];
      detail.dx = lastInfo.x - firstInfo.x;
      detail.dy = lastInfo.y - firstInfo.y;
      detail.ddx = previousInfo.x - lastInfo.x;
      detail.ddy = previousInfo.y - lastInfo.y;
    }
    return detail;
  }

  disconnectedCallback() {
    this._removeEndListener();
    this._removeTrackListener();
    this._removeStartListener();
    this._trackQueue.clear();
    delete this._trackQueue;
  }

  _init(e) {
    this._trackQueue.length = 0;
    this._eventTransformer = computeEventTransform(e, this.autoOffset);
    if (!this._eventTransformer) {
      return;
    }
    this._isMouse = isMouseEvent(e.type);
    this._currentTarget = e.composedPath()[0];
    this._appendToTrackQueue(e, 'start');
    this._first = this._trackQueue[0];
  }

  _appendToTrackQueue(e, state = 'track') {
    if (!this._eventTransformer) return;
    let info = this._eventTransformer(e);
    info.state = state;
    this._trackQueue.push(info);
    this._reduceTrackQueue();
  }

  _reduceTrackQueue(maxlen = this._maxlength) {
    if (maxlen === undefined) return;
    while (this._trackQueue.length > maxlen) {
      this._trackQueue.shift();
    }
  }

  _dispatchTrackEvent(type = 'track') {
    if (!this._currentTarget) return;
    let e = new Event(type, this.dispatchEventOptions);    
    e.detail = this.detail;
    this._currentTarget.dispatchEvent(e);
  }

  _onStart(e) {
    this._init(e);
    if (!this._eventTransformer) {
      return;
    }
    this._dispatchTrackEvent('track-start');
    this._dispatchTrackEvent();
    this._addTrackListener(e);
  }

  _onMove(e) {
    this._appendToTrackQueue(e);
    this._dispatchTrackEvent();
  }

  _onEnd(e) {
    this._appendToTrackQueue(e, 'end');
    this._dispatchTrackEvent('track-end');
    this._dispatchTrackEvent();
    this._removeTrackListener();
  }

  _addStartListener() {
    this.addEventListener('mousedown', this._onStart, this.eventListenerOptions);
    this.addEventListener('touchstart', this._onStart, this.eventListenerOptions);
  }

  _removeStartListener() {
    this.removeEventListener('mousedown', this._onStart, this.eventListenerOptions);
    this.removeEventListener('touchstart', this._onStart, this.eventListenerOptions);
  }

  _addTrackListener() {
    if (this._isMouse) {
      document.addEventListener('mousemove', this._onMove, this.eventListenerOptions);
      document.addEventListener('mouseup', this._onEnd, this.eventListenerOptions);
    } else {
      document.addEventListener('touchmove', this._onMove, this.eventListenerOptions);
      document.addEventListener('touchend', this._onEnd, this.eventListenerOptions);
    }
  }

  _removeTrackListener() {
    if (this._isMouse) {
      document.removeEventListener('mousemove', this._onMove, this.eventListenerOptions);
      document.removeEventListener('mouseup', this._onEnd, this.eventListenerOptions);
    } else {
      document.removeEventListener('touchmove', this._onMove, this.eventListenerOptions);
      document.removeEventListener('touchend', this._onEnd, this.eventListenerOptions);
    }
  }
};

customElements.define('track-box', TrackBox);

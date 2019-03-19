let shadowDOMTemplate = document.createElement('template');
shadowDOMTemplate.innerHTML = `
  <style>
    :host {
      display: inline-block;
    }
    #input {
      color: inherit;
      background: transparent;
    }
    #minlength,
    #size,
    #input {
      box-sizing: content-box;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      font-style: inherit;
      letter-spacing: inherit;
      outline: none;
      margin: 0;
      padding: 0;
    }
    #minlength,
    #size {
      position: fixed;
      top: 0; left: 0; right: auto; bottom: auto;
      visibility: hidden;
    }
  </style>
  <div id="input" contenteditable="true"></div>
  <div id="size"></div>
  <div id="minlength"></div>
`;

let hiddenInputTemplate = document.createElement('template');
hiddenInputTemplate.innerHTML = `
  <input type="hidden"/>
`;

export class InputElement extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({mode: 'open', delegatesFocus: true});
    shadowRoot.appendChild(shadowDOMTemplate.content.cloneNode(true));
    this.appendChild(hiddenInputTemplate.content.cloneNode(true));
  }
  connectedCallback() {
  }
};

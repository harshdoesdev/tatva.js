# tatva.js
Tatva (Sanskrit word "तत्त्व", meaning "Element") is a Tiny Toolkit For Web Components.

## Installation
```bash
npm i tatva
```

## Usage
```javascript
import { template, style } from 'tatva';

const defaultButtonStyle = style`
  button {
    display: block;
    margin: 0;
    padding: 0;
    background: transparent;
    outline: none;
    border: none;
    vertical-align: middle;
    white-space: nowrap;
    cursor: pointer;
  }
`;

const fancyButtonStyle = style`
  .fancy-button {
    padding: .6rem .8rem;
    min-height: 2.5rem;
    background: blue;
    color: #fff;
    border-radius: .5rem;
    font-weight: bold;
  }
`;

const tmpl = template`
    <button class="fancy-button">Click me<button>
`;

class FancyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [defaultButtonStyle, fancyButtonStyle];
  }

  connectedCallback() {
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
    const button = this.shadowRoot.querySelector("button");
    button.addEventListener("click", () => console.log("Hello world!"));
  }

}

customElements.define("fancy-button", FancyButton);
```

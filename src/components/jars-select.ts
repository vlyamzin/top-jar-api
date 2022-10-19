import { LitElement, html, css, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators/property.js'

const tagName = 'jars-select'

export class JarsSelect extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ];

  @property({reflect: true}) url: string = ''

  firstUpdated() {
    console.log(this.url);
    // fetch(this.url)
  }

  render() {
    return html`Hello`;
  }
}

customElements.define(tagName, JarsSelect);

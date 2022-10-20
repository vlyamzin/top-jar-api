import { LitElement, html, css, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import type { JarBasic } from '../../definition/jar.type';

const tagName = 'jars-select';

export class JarsSelect extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ];

    @property({ reflect: true }) url: string = '';
    @state() title: string = ' ';
    @state() jars: JarBasic[] = [];

    async firstUpdated() {
        try {
            const response = await fetch(this.url);

            if (!response.ok) {
                this.title = 'Damn, козаче! Притримай коней. Monobank так швидко не вміє :(';
            }

            const data = await response.json();
            this.title = `Yo, ${data.username}!`;
            this.jars = data.jars;
        } catch (e) {
            console.log(e);
            this.title = 'Damn, сервер тойво, як хуйло :(';
        }
    }

    render() {
        return html`
            <h1>${this.title}</h1>
            ${this.jars.length > 0
                ? html`
                      <h3>Вибери банку зі списку</h3>
                  `
                : null}
            <ul>
                ${(this.jars || []).map(jar => {
                    const link = `/jar?id=${jar.id}`;

                    return html`
                        <li><a href="${link}">${jar.title}</a></li>
                    `;
                })}
            </ul>
        `;
    }
}

customElements.define(tagName, JarsSelect);

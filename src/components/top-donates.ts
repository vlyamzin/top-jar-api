import { LitElement, html, css, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import type { Donate } from '../../definition/donate.type';

const tagName = 'top-donates';
const topDonatesCount = 5;

export class TopDonates extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .error {
                font-size: 20px;
                color: red;
            }
        `,
    ];

    @property({ reflect: true }) url: string = '';

    @state() donates: Donate[] = [];
    @state() error: string = ' ';

    private jarId: string | null = null;
    private timer: number | null = null;

    connectedCallback() {
        super.connectedCallback();
        const urlParams = new URLSearchParams(location.search);
        const id = urlParams.get('id');
        this.jarId = id;
    }

    disconnectedCallback(): void {
        if (this.timer) {
            window.clearInterval(this.timer);
        }
        super.disconnectedCallback();
    }

    protected firstUpdated(): void {
        this.watchStatements();
    }

    render() {
        return html`
            <ul>
                ${(this.donates || []).map(
                    donate => html`
                        <li>${donate.amount}</li>
                    `,
                )}
            </ul>

            ${this.error.length < 2
                ? html`
                      <p>Оновлюється раз в хвилину!</p>
                  `
                : html`
                      <p class="error">${this.error}</p>
                  `}
        `;
    }

    private watchStatements() {
        this.fetchData();

        this.timer = window.setInterval(() => {
            this.fetchData();
        }, 60000);
    }

    private async fetchData() {
        if (this.jarId && this.url) {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 20);
            const api = new URL(this.url);
            api.searchParams.append('jarId', this.jarId);
            api.searchParams.append('from', monthAgo.getTime().toString());
            api.searchParams.append('count', topDonatesCount.toString());

            try {
                const response = await fetch(api);

                if (response.ok) {
                    const data = await response.json();
                    this.donates = data.donates;
                } else {
                    throw new Error('Statement API: Too many requests');
                }
            } catch (e) {
                console.log(e);
                this.error = 'Damn, сервер ліг. Слухай музичку :)';
            }
        }
    }
}

customElements.define(tagName, TopDonates);

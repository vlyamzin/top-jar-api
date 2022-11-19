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
                padding: 1rem 2rem;
            }

            .error {
                font-size: 20px;
                color: red;
            }

            ol {
                counter-reset: li; /* Initiate a counter */
                list-style: none; /* Remove default numbering */
                *list-style: decimal; /* Keep using default numbering for IE6/7 */
                font: 15px 'trebuchet MS', 'lucida sans';
                padding: 0;
                margin-bottom: 4em;
                text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
            }

            .rounded-list span {
                position: relative;
                display: block;
                padding: 0.4em 0.4em 0.4em 2em;
                *padding: 0.4em;
                margin: 0.5em 0;
                background: #ddd;
                color: #444;
                text-decoration: none;
                border-radius: 0.3em;
                font-size: 1.3rem;
            }

            .rounded-list span:before {
                content: counter(li);
                counter-increment: li;
                position: absolute;
                left: -1.3em;
                top: 50%;
                margin-top: -1.3em;
                background: #87ceeb;
                height: 2em;
                width: 2em;
                line-height: 2em;
                border: 0.3em solid #fff;
                text-align: center;
                font-weight: bold;
                border-radius: 2em;
                transition: all 0.3s ease-out;
                color: #3a3939;
            }

            .rounded-list li:nth-child(2n) span:before {
                background: #f7dc0f;
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
            <ol class="rounded-list">
                ${(this.donates || []).map(
                    donate => html`
                        <li><span>${donate.amount} - ${donate.comment}</span></li>
                    `,
                )}
            </ol>

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

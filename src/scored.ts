import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { connect } from 'pwa-helpers';
import store from './redux/store';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('score-cards')
export class ScoreCards extends connect(store)(LitElement) {
  render() {
    return html`
      <h1>Scored</h1>
      <p>Keep score for your favourite games</p>
    `
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'score-cards': ScoreCards,
  }
}

import { css, html, LitElement } from "lit";
import {
  customElement,
  // property,
  // state,
} from "lit/decorators.js";
// import { getEpre } from "../../utils/general-utils";

// const ePre = getEpre('select-type');

@customElement('players-list')
export class PlayerList extends LitElement {
  // @property({ type: Array })
  // types: TGameTypes = [];

  // @property({ type: String })
  // lastType: string = '';

  // @state()
  // private _typeID: string = '';

  render() {
    return html``;
  }

  static styles = css``
}

declare global {
  interface HTMLElementTagNameMap {
    'players-list': PlayerList,
  }
}

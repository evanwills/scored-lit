import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TGameType, TGameTypes } from "../../types/custom-redux-types";
import { ifDefined } from "lit/directives/if-defined.js";
import { sendToStore } from "../../redux/redux-utils";
import { addNewGame } from "../../redux/currentGame/current-actions";
// import { getEpre } from "../../utils/general-utils";

const optionLoopItem = (id: string) => (item : TGameType) => {
  const selected = (id === item.id)
    ? true
    : undefined;

  return html`
    <option value="${item.id}" ?selected="${ifDefined(selected)}">
      ${item.name}
    </option>`;
};

// const ePre = getEpre('select-type');

@customElement('select-game-type')
export class SelectGameType extends LitElement {
  @property({ type: Array })
  types: TGameTypes = [];

  @property({ type: String })
  lastType: string = '';

  @state()
  private _typeID: string = '';

  handleTypeSelect(event: InputEvent) {
    const matched = this.types.find((type) => (type.id === (event.target as HTMLSelectElement).value));

    if (typeof matched !== 'undefined') {
      this._typeID = matched.id;
    }
  };

  handleConfirmType() {
    if (this._typeID !== '') {
      sendToStore(this, addNewGame(this._typeID));
    }
  };

  render() {
    return html`
      <p>
        <label for="game-type">Choose the type of game you're about to play</label>
        <select id="game-type" @change="${this.handleTypeSelect}">
          <option value="--"> -- choose game type --</option>
          ${this.types.map(optionLoopItem(this._typeID))}
        </select>
      </p>
      ${(this._typeID !== '') ? html`
      <p><button @click=${this.handleConfirmType}>Add players</button></p>
      ` : ''}
    `
  };


  static styles = css`
    .label {
      white-space: wrap;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'select-game-type': SelectGameType,
  }
}


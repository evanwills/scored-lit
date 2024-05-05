import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TGameType, TGameTypes } from "../../types/custom-redux-types";
import { ifDefined } from "lit/directives/if-defined.js";

const optionLoopItem = (id: string) => (item : TGameType) => {
  const selected = (id === item.id)
    ? true
    : undefined;

  return html`
    <option value="${item.id}" ?selected="${ifDefined(selected)}">
      ${item.name}
    </option>`;
}

@customElement('select-game-type')
export class SelectGameType extends LitElement {
  @property({ type: Array })
  types: TGameTypes = [];

  @property({ type: String })
  lastType: string = '';

  @state()
  private _typeID: string = '';

  handleTypeSelect(event: InputEvent) {
    const matched = this.types.filter((type) => (type.id === (event.target as HTMLSelectElement).value));

    if (matched.length > 0) {
      this._typeID = matched[0].id;
    }
  };

  handleConfirmType() {
    if (this._typeID !== '') {
      const event = new CustomEvent(
        'setgametype',
        {
          bubbles: true,
          composed: true,
          detail: { value: this._typeID },
        }
      );

      this.dispatchEvent(event);
    }
  };

  render() {
    return html`
      <p>
        <label for="game-type">Choose the type of game you're about to play</label>
        <select id="game-type" @change="${this.handleTypeSelect}">
          ${this.types.map(optionLoopItem(this._typeID))}
        </select>
      </p>
      ${(this._typeID !== '') ? html`
      <p><button @click="">Add players</button></p>
      ` : ''}
    `
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'select-game-type': SelectGameType,
  }
}


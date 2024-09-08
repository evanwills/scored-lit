import { css, html, LitElement } from 'lit';
import {
  customElement,
  property,
  state,
  // state,
} from 'lit/decorators.js';
// import { renderNameField } from './pure-player-list-renderers';
// import { sendToStore } from '../../redux/redux-utils';
// import { addNewPlayerAction, updatePlayerAction } from '../../redux/players/players-actions';
// import { nanoid } from 'nanoid';
// import { inputHasValue } from '../../type-guards';
// import { normaliseName } from '../../utils/general-utils';
// import { ifDefined } from 'lit/directives/if-defined.js';
// import { getEpre } from '../../utils/general-utils';
import './player-data-form';

// const ePre = getEpre('players-list');

@customElement('player-list-item')
export class PlayerListItem extends LitElement {
  // ------------------------------------------------------
  // START: props

  @property({ type: String, attribute: 'given-name' })
  givenName : string = '';

  @property({ type: String, attribute: 'family-name' })
  familyName : string = '';

  @property({ type: String, attribute: 'player-id' })
  playerID : string = '';

  @property({ type: Array, attribute: 'normal-names' })
  normalisedNames : string[] = [];

  //  END:  props
  // ------------------------------------------------------
  // START: state

  @state()
  displayName : string = '';

  private details : HTMLDetailsElement|null = null;
  private summary : HTMLElement|null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper methods

  detailsID() {
    return `player-item--${this.playerID}`;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  closeDetails() {
    if (this.details === null) {
      if (this.shadowRoot !== null) {
        const tmp = this.shadowRoot.querySelector(`#${this.detailsID()}`);
        if (typeof tmp !== 'undefined') {
          this.details = tmp as HTMLDetailsElement;
          const sum = this.details.querySelector('summary');

          if (typeof sum !== 'undefined') {
            this.summary = sum;
          }
        }
      }
    }

    if (this.details !== null && this.details.open === true) {
      this.details.open = false;

      if (this.summary !== null) {
        this.summary.focus();
      }
    }
  }
  updateName(event: CustomEvent) {
    console.group('updateName()');
    console.log('this.displayName (before):', this.displayName);
    console.log('event.detail.givenName', event.detail.givenName);
    console.log('event.detail.familyName', event.detail.familyName);
    this.displayName = `${event.detail.givenName} ${event.detail.familyName} `;
    this.requestUpdate();
    console.log('this.displayName (after):', this.displayName);
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: main render method
  render() {
    console.log('this:', this);
    console.log('this.givenName:', this.givenName);
    console.log('this.familyName:', this.familyName);
    console.log('this.playerID:', this.playerID);
    console.log('this.normalisedNames:', this.normalisedNames);
    if (this.displayName === '') {
      this.displayName = `${this.givenName} ${this.familyName}`;
    }
    return html`
      <details id="${this.detailsID()}" name="player-list">
        <summary>
          <span class="sr-only">Edit</span> ${this.displayName}
        </summary>

        <div>
          <player-data-form
            edit
            family-name="${this.familyName}"
            given-name="${this.givenName}"
            player-id="${this.playerID}"
            normalised-names=${this.normalisedNames}
            @reduxaction=${this.closeDetails}
            @updated=${this.updateName}></player-data-form>
        </div>
      </details>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    h2 { margin-bottom: 0.5rem; }
    p { margin-top: 0;}
    ul {
    }
    li {
      border-top: 0.05rem solid #ddd;
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0.25rem 0;
    }
    details {
      inline-size: 100%;
      /* block-size: 1.5rem; */
      /* transition: block-size ease-in-out 0.3s; */
    }
    /*
    details:open {
      block-size: auto;
      block-size: calc-size(auto);
    }
    */
    summary {
      cursor: pointer;
    }
    div {
      block-size: auto;
      transition: all 0.3s ease-in-out;
    }
    .field-wrap {
      border-top: 0.05rem solid #fff
    }
    .field-item {
      border-bottom: 0.05rem solid #fff;
      padding-bottom: 0.5rem;;
      padding-top: 0.5rem;
    }
    .field-item label {
      display: inline-block;
      inline-size: 6.5rem;
    }
    .field-item label::after {
      content: ':';
    }
    .field-item input {
      flex-grow: 1;
    }
    .list-item {
      display: flex;
      border-top: rgba(255,255,255,5);
    }
    .list-item label {
      flex-grow: 1;
    }`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'player-list-item': PlayerListItem,
  }
}

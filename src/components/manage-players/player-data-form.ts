import { css, html, LitElement } from 'lit';
import {
  customElement,
  property,
  state,
  // state,
} from 'lit/decorators.js';
import { renderNameField } from './pure-player-list-renderers';
import { sendToStore } from '../../redux/redux-utils';
import { addNewPlayerAction, deletePlayerAction, updatePlayerAction } from '../../redux/players/players-actions';
import { nanoid } from 'nanoid';
import { inputHasValue } from '../../type-guards';
import { normaliseName } from '../../utils/general-utils';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nameIsDuplicate } from '../../utils/player-utils';
// import { getEpre } from '../../utils/general-utils';

// const ePre = getEpre('players-list');

@customElement('player-data-form')
export class PlayerDataForm extends LitElement {
  // ------------------------------------------------------
  // START: props

  @property({ type: String, attribute: 'given-name' })
  givenName : string = '';

  @property({ type: String, attribute: 'family-name' })
  familyName : string = '';

  @property({ type: String, attribute: 'player-id' })
  playerID : string = '';

  @property({ type: Boolean })
  edit: boolean = false;

  @property({ type: Array, attribute: 'normal-names' })
  normalisedNames : string[] = [];

  //  END:  props
  // ------------------------------------------------------
  // START: state

  @state()
  _isDupe : boolean = false;

  @state()
  _showError : boolean = false;


  @state()
  _givenName : string = this.givenName;


  @state()
  _familyName : string = this.givenName;

  @state()
  _warningMsg : string = '';

  @state()
  _canSave : boolean = false;

  //  END:  state
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() {
    super.connectedCallback()
    this._givenName = this.givenName;
    this._familyName = this.familyName;
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper methods



  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  keyupHandler(event : InputEvent) {
    if (typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      const value = event.target.value.replace(/^\s+|[^a-z0-9' ]+/ig, '');
      const initial = (typeof event.target.dataset.initial === 'string' && event.target.dataset.initial !== '')
        ? event.target.dataset.initial
        : null;

      if (initial === null || initial !== value) {
        if (event.target.id.includes('family')) {
          this._familyName = value;
        } else {
          this._givenName = value;
        }
        const normalised = normaliseName(this._givenName + this._familyName);

        this._isDupe = nameIsDuplicate(normalised, this.normalisedNames);
        this._canSave = !this._isDupe;
      }
    }
  }

  submitHandler(event : SubmitEvent) {
    event.preventDefault();

    let warningMsg = '';

    if (this._isDupe === false) {
      this._givenName = this._givenName.trim();
      this._familyName = this._familyName.trim();
      const normalisedName = normaliseName(this._givenName + this._familyName);

      if (this.edit === true) {
        if (this._givenName !== this.givenName || this._familyName !== this.familyName) {
          sendToStore(
            this,
            updatePlayerAction({
              id: this.playerID,
              name: this._givenName,
              secondName: this._familyName,
              normalisedName,
            }),
          );
          this.dispatchEvent(new CustomEvent('updated', { detail: { givenName: this._givenName, familyName: this._familyName, }}))
        } else {
          warningMsg = 'Name is unchanged (No point in submitting)';
        }
      } else if (this._givenName !== '' || this._familyName !== '') {
        sendToStore(
          this,
          addNewPlayerAction({
            id: nanoid(),
            name: this._givenName,
            secondName: this._familyName,
            normalisedName,
          }),
        );

        this._givenName = '';
        this._familyName = '';
      } else {
        warningMsg = 'Given name or family name must not be empty';
      }
    } else {
      warningMsg = 'You cannot add a player if their name already exists';
    }

    this._warningMsg = warningMsg;
    console.groupEnd();
  }

  deleteHandler() {
    sendToStore(this, deletePlayerAction(this.playerID));
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: main render method
  render() {
    const pre = 'new-player-btn'
    const btnCls = (this._isDupe === true)
      ? `${pre} ${pre}-error`
      : pre;

    let label = 'Add';
    let heading = 'New player';
    let labelBy = 'players-data-form-head';
    let action = '#add-player';

    if (this.edit === true) {
      label = 'Update';
      heading = `Update ${this.givenName} ${this.familyName}`;
      action += `--${this.playerID}`;
      labelBy += `--${this.playerID}`;
    }

    let descByID : string | undefined = undefined;

    if (this._isDupe === true) {
      descByID = 'duplicate-player-msg';
    }
    if (this._warningMsg !== '') {
      descByID += ' submit-warning';
    }

    return html`
      <form
        action="${action}"
        aria-labelledby="${labelBy}"
        class="${this.edit === true ? 'edit-mode' : ''}"
        method="post"
        @submit=${this.submitHandler}>
        <div
          arial-labeldby="${labelBy}"
          aria-describedby="${ifDefined(descByID)}"
          role="group">
          ${(this.edit === false)
            ? html`<h2 id="${labelBy}">${heading}</h2>`
            : html`<h3 id="${labelBy}">${heading}</h3>`
          }

          <ul class="field-wrap">
            <li class="list-item">
              ${renderNameField(
                this.playerID,
                'Given',
                this._givenName,
                this.givenName,
                'Gabbie',
                this._isDupe,
                this.keyupHandler,
              )}
            </li>

            <li class="list-item">
              ${renderNameField(
                this.playerID,
                'Family',
                this._familyName,
                this.familyName,
                'Augustus',
                this._isDupe,
                this.keyupHandler,
              )}
            </li>
          </ul>

          ${(this._isDupe === true)
            ? html`
              <p id="duplicate-player-msg">
                Player "${this._givenName} ${this._familyName}" already exists in the system.<br />
                Please choose a different name
              <p>`
            : ''
          }

          ${(this._warningMsg !== '')
            ? html`<p id="submit-warning" class="submit-warning">${this._warningMsg}</p>`
            : ''
          }

          <p>
            <button
              .class="${btnCls}"
              ?disabled=${!this._canSave}
              type="submit"
              value="${label.toLocaleLowerCase()}">
              ${label} <span class="sr-only">player</span>
            </button>
            ${(this.edit === true)
              ? html`
                <button
                .class="${btnCls}"
                type="button"
                value="delete"
                @click=${this.deleteHandler}>
                Delete <span class="sr-only">player</span>
              </button>`
              : ''
            }
          </p>
        </div>
      </form>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    h2, h3 { margin: 0.5rem 0; }
    p { margin-top: 0;}
    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
    li {
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
    }
    p { margin: 0.5rem 0 0; }
    .edit-mode {
      margin-bottom: 0.75rem;
    }
    .field-wrap {
      border-top: 0.05rem solid #555;
      margin: 0;
      padding: 0;
    }
    .field-item {
      border-bottom: 0.05rem solid #555;
      padding-bottom: 0.5rem;;
      padding-top: 0.5rem;
    }
    .field-item label {
      display: inline-block;
      width: 6.5rem;
    }
    .field-item label::after {
      content: ':';
    }
    .field-item input {
      flex-grow: 1;
    }
    .list-item {
      display: flex;
    }
    .list-item label {
      flex-grow: 1;
    }`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'player-data-form': PlayerDataForm,
  }
}

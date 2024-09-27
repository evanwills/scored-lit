import { css, html, LitElement, TemplateResult } from 'lit';
import {
  customElement,
  property,
  state,
} from 'lit/decorators.js';
import { getEpre, normaliseName } from '../../utils/general-utils';
import { ITeam, IIndividualPlayer } from '../../types/players';
import { renderNameField } from '../manage-players/pure-player-list-renderers';
import '../current-game/select-players';
import { inputHasValue, isSelectedPlayerDetails } from '../../type-guards';
import { membersAreSame, nameIsDuplicate } from '../../utils/player-utils';
import { sendToStore } from '../../redux/redux-utils';
import { addNewTeamAction, deleteTeamAction, updateTeamAction } from '../../redux/teams/team-actions';
import { nanoid } from 'nanoid';
const ePre = getEpre('team-data-form');

@customElement('team-data-form')
export class TeamDataFprm extends LitElement {
  // ------------------------------------------------------
  // START: props

  @property({ type: Array })
  allplayers : IIndividualPlayer[] = [];

  @property({ type: Array })
  allteams : ITeam[] = [];

  @property({ type: Boolean })
  edit: boolean = false;

  @property({ type: Number })
  max: number = 0;

  @property({ type: Array })
  members : string[] = [];

  @property({ type: Number })
  min: number = 0;

  @property({ type: Array })
  normalisednames : string[] = [];

  @property({ type: String })
  teamid : string = '';

  @property({ type: String })
  teamname: string = '';

  //  END:  props
  // ------------------------------------------------------
  // START: state

  @state()
  _isDupe : boolean = false;

  @state()
  _showError : boolean = false;


  @state()
  _teamName : string = this.teamname;

  @state()
  _overrideName : boolean = true;

  @state()
  _members : string[] = this.members;

  @state()
  _warningMsg : string = '';

  //  END:  state
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() {
    console.group(ePre('connectedCallback'));
    super.connectedCallback()
    this._teamName = this.teamname;
    this._members = this.members;
    console.log('this:', this);
    console.log('this.teamid:', this.teamid);
    console.log('this.allteams:', this.allteams);
    console.log('this.allplayers:', this.allplayers);
    console.log('this.teamname:', this.teamname);
    console.log('this._teamName:', this._teamName);
    console.log('this.members:', this.members);
    console.log('this.normalisednames:', this.normalisednames);
    console.groupEnd();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  deleteHandler() {
    sendToStore(this, deleteTeamAction(this.teamid));
  }

  keyupHandler(event : InputEvent) {
    // console.group(ePre('keyupHandler'));
    // console.log('event:', event);
    // console.log('this.normalisednames:', this.normalisednames)
    if (typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      this._overrideName = false;
      console.log('event.target:', event.target);
      const value = event.target.value.replace(/^\s+|[^a-z0-9,' &#-]+/ig, '');
      console.log('value:', value);

      const initial = (typeof event.target.dataset.initial === 'string' && event.target.dataset.initial !== '')
        ? event.target.dataset.initial
        : null;
      if (initial === null || initial !== value) {
        const normalised = normaliseName(value);

        this._isDupe = nameIsDuplicate(normalised, this.normalisednames);
        this._teamName = value;
      }

      // console.log('initial:', initial);
    }
    // console.groupEnd();
  }

  submitHandler(event : SubmitEvent) {
    event.preventDefault();

    let warningMsg = '';

    if (this._isDupe === false) {
      if (this._members.length > 1) {
        this._teamName = this._teamName.trim();
        const normalisedName = normaliseName(this._teamName);

        if (this.edit === true) {
          if (this._teamName !== this.teamname || !membersAreSame(this.members, this._members)) {
            sendToStore(
              this,
              updateTeamAction({
                id: this.teamid,
                name: this._teamName,
                members: this._members,
                normalisedName,
              }),
            );
            this.dispatchEvent(new CustomEvent('updated', { detail: this._teamName }));
          } else {
            warningMsg = 'Name or members list is unchanged.';
          }
        } else if (this._teamName !== '') {
          sendToStore(
            this,
            addNewTeamAction({
              id: nanoid(),
              name: this._teamName,
              members: this._members,
              normalisedName,
            }),
          );

          this._teamName = '';
          this._overrideName = true;
          this._members = [];
        } else {
          warningMsg = 'Team name must not be empty.';
        }
      }
    }

    this._warningMsg = warningMsg;
  }

  playerSelectedHandler(event: CustomEvent) {
    // console.group(ePre('playerSelectedHandler'));
    // console.log('event:', event);
    // console.log('event.detail:', event.detail);
    // console.log('isSelectedPlayerDetails(event.detail):', isSelectedPlayerDetails(event.detail));
    // console.log('this._overrideName:', this._overrideName);

    if (isSelectedPlayerDetails(event.detail)) {
      this._members = event.detail.IDs;

      if (this._overrideName === true) {
        this._teamName = event.detail.players.map((player : IIndividualPlayer) : string => {
          const output = player.name + ' ' + player.secondName;
          return output.trim();
        }).join(', ').replace(/, (?=[^,]+$)/, ' & ');
      }
    }

    // console.log('this._overrideName:', this._overrideName);
    // console.log('this._teamName:', this._teamName);
    // console.groupEnd();
  }

  playerSelectedErrorHandler(event: CustomEvent) {

  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    console.group(ePre('render'));
    const pre = 'new-team-btn'
    const btnCls = (this._isDupe === true)
      ? `${pre} ${pre}-error`
      : pre;

    let label = 'Add';
    let heading = 'New team';
    let labelBy = 'team-data-form-head';
    let action = '#add-player';

    if (this.edit === true) {
      label = 'Update';
      heading = `Update ${this._teamName}`;
      action += `--${this.teamid}`;
      labelBy += `--${this.teamid}`;
    }
    // console.log('this:', this);
    // console.log('this.teamid:', this.teamid);
    console.log('this.members:', this.members);
    console.log('this._members:', this._members);
    // console.log('this.normalisednames:', this.normalisednames);
    // console.log('this.teamname:', this.teamname);
    // console.log('this._teamName:', this._teamName);
    // console.log('this.allteams:', this.allteams);
    // console.log('this.allplayers:', this.allplayers);

    let descByID : string | undefined = undefined;

    if (this._isDupe === true) {
      descByID = 'duplicate-team-msg';
      if (this.edit === true) {
        descByID += `--${this.teamid}`
      }
    }
    if (this._warningMsg !== '') {
      descByID += ' submit-warning';
    }
    console.groupEnd();
    return html`
      <form
        action="${action}"
        aria-labelledby="label"
        class="${this.edit === true ? 'edit-mode' : ''}"
        method="post"
        @submit=${this.submitHandler}>
        ${(this.edit === false)
          ? html`<h3 id="${labelBy}">${heading}</h3>`
          : ''
        }
        <select-players
          .allplayers=${this.allplayers}
          .allteams=${this.allteams}
          .max="${this.max}"
          .min="${this.min}"
          .refid=${this.teamname}
          .selectedplayers=${this._members}
          @playerselected=${this.playerSelectedHandler}></select-players>

        <ul class="field-wrap">
          ${renderNameField(
            this.teamid,
            'Team name',
            this._teamName,
            this.teamname,
            'Chicken lovers',
            this._isDupe,
            this.keyupHandler,
            'general',
          )}
        </ul>
        <p>
          <button
            .class="${btnCls}"
            type="submit"
            value="${label.toLocaleLowerCase()}">
            ${label} <span class="sr-only">team</span>
          </button>
          ${(this.edit === true)
            ? html`
              <button
              .class="${btnCls}"
              type="button"
              value="delete"
              @click=${this.deleteHandler}>
              Delete <span class="sr-only">team</span>
            </button>`
            : ''
          }
        </p>
      </form>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    input:invalid {
      outline: 0.2rem solid #c00;
      outline-offset: 0.1rem
    }
    h3 {
      margin: 0;
    }

    .field-wrap {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
    .field-wrap li {
      margin: 0;
      padding: 0.25rem 0;
      display: flex;
      column-gap: 0.5rem;
    }
    .field-wrap label {
      font-weight: bold;
    }
    .field-wrap label::after {
      content: ':';
    }
    .field-wrap input {
          flex-grow: 1;
    }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'team-data-form': TeamDataFprm,
  }
}

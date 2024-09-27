import { css, html, LitElement, TemplateResult } from 'lit';
import {
  customElement,
  property,
  state,
} from 'lit/decorators.js';
import { getEpre, normaliseName } from '../../utils/general-utils';
import { IPlayer, ITeam } from '../../types/players';
import { renderNameField } from '../manage-players/pure-player-list-renderers';
import '../current-game/select-players';
import { inputHasValue } from '../../type-guards';
import { nameIsDuplicate } from '../../utils/player-utils';
const ePre = getEpre('team-data-form');

@customElement('team-data-form')
export class TeamDataFprm extends LitElement {
  // ------------------------------------------------------
  // START: props

  @property({ type: Array })
  allplayers : IPlayer[] = [];

  @property({ type: Array })
  allteams : ITeam[] = [];

  @property({ type: Boolean })
  edit: boolean = false;

  @property({ type: Array })
  members : string[] = [];

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

  keyupHandler(event : InputEvent) {
    console.group(ePre('keyupHandler'));
    console.log('event:', event);
    console.log('this.normalisednames:', this.normalisednames)
    if (typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      console.log('event.target:', event.target);
      const value = event.target.value.replace(/^\s+|[^a-z0-9' &#-]+/ig, '');
      console.log('value:', value);

      const initial = (typeof event.target.dataset.initial === 'string' && event.target.dataset.initial !== '')
        ? event.target.dataset.initial
        : null;
      if (initial === null || initial !== value) {
        const normalised = normaliseName(value);

        this._isDupe = nameIsDuplicate(normalised, this.normalisednames);
        this._teamName = value;
      }

      console.log('initial:', initial);
    }
    console.groupEnd();
  }

  submitHandler(event : SubmitEvent) {
    event.preventDefault();
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    console.group(ePre('render'));
    // const pre = 'new-team-btn'
    // const btnCls = (this._isDupe === true)
    //   ? `${pre} ${pre}-error`
    //   : pre;

    // let label = 'Add';
    let heading = 'New team';
    let labelBy = 'team-data-form-head';
    let action = '#add-player';

    if (this.edit === true) {
      // label = 'Update';
      heading = `Update ${this.teamid}`;
      action += `--${this.teamid}`;
      labelBy += `--${this.teamid}`;
    }
    console.log('this:', this);
    console.log('this.teamid:', this.teamid);
    console.log('this.members:', this.members);
    console.log('this.normalisednames:', this.normalisednames);
    console.log('this.teamname:', this.teamname);
    console.log('this._teamName:', this._teamName);
    console.log('this.allteams:', this.allteams);
    console.log('this.allplayers:', this.allplayers);

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
          ? html`<h2 id="${labelBy}">${heading}</h2>`
          : html`<h3 id="${labelBy}">${heading}</h3>`
        }
        <select-players
          .allplayers=${this.allplayers}
          .allteams=${this.allteams}></select-players>

        <ul class="field-wrap">
          <li class="list-item">
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
          </li>
        </ul>
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
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'team-data-form': TeamDataFprm,
  }
}

import { css, html, LitElement } from 'lit';
import {
  customElement,
  property,
  state,
} from 'lit/decorators.js';
import { IIndividualPlayer, IIndividualPlayerFilterable, ITeam } from '../../types/players';
import { inputHasValue } from '../../type-guards';
import { normaliseName } from '../../utils/general-utils';
import { repeat } from 'lit/directives/repeat.js';
import { sendToStore } from '../../redux/redux-utils';
import { ifDefined } from 'lit/directives/if-defined.js';
import { addNewPlayerAction } from '../../redux/players/players-actions';
import { getEpre } from '../../utils/general-utils';
import { nanoid } from 'nanoid';

const ePre = getEpre('players-list');

@customElement('players-list')
export class PlayerList extends LitElement {
  // ------------------------------------------------------
  // START: props

  @property({ type: Array })
  players: IIndividualPlayer[] = [];

  @property({ type: Array })
  teams: ITeam[] = [];

  @property({ type: Boolean })
  selecting: boolean = false;

  //  END:  props
  // ------------------------------------------------------
  // START: state

  @state()
  filterStr: string = '';

  @state()
  rawFilter: string = '';

  @state()
  allPlayers: IIndividualPlayerFilterable[] = [];

  @state()
  filteredPlayers: IIndividualPlayerFilterable[] = [];

  @state()
  newPlayerGivenName: string = '';

  @state()
  newPlayerFamilyName: string = '';

  @state()
  newPlayerNormalised: string = '';

  @state()
  newPlayerDuplicate: boolean = false;

  //  END:  state
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper methods



  prepareAllPlayers() {
    if (this.players.length !== this.allPlayers.length) {
      console.group(ePre('prepareAllPlayers'));
      console.log('this.players:', this.players)
      console.log('this.allPlayers (before):', this.allPlayers)
      console.log('this.filteredPlayers (before):', this.filteredPlayers)
      this.allPlayers = this.players.map((player: IIndividualPlayer) : IIndividualPlayerFilterable => {
        return {
          ...player,
          normalisedName: normaliseName(player.name + player.secondName),
        };
      })
      this.filteredPlayers = [...this.allPlayers];
      console.log('this.filteredPlayers (after):', this.filteredPlayers)
      console.log('this.allPlayers (after):', this.allPlayers)
      console.groupEnd();
    }
  }

  setFilteredPlayers() {
    this.filteredPlayers = (this.filterStr === '')
        ? [...this.allPlayers]
        : this.allPlayers.filter((player) => player.normalisedName.includes(this.filterStr));
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleFilterKeyUp(event: InputEvent) {
    if (typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      this.rawFilter = event.target.value;
      this.filterStr = normaliseName(event.target.value);
      this.setFilteredPlayers();
    }
  }

  handleNameKeyUp(event: InputEvent) {
    if (typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      const value = event.target.value.replace(/^\s+|[^a-z0-9 ]+/ig, '');

      if (event.target.id.indexOf('family') > -1) {
        this.newPlayerFamilyName = value;
      } else {
        this.newPlayerGivenName = value;
      }
      this.newPlayerNormalised = normaliseName(this.newPlayerGivenName + this.newPlayerFamilyName);

      const tmp = this.allPlayers.find((player) => player.normalisedName === this.newPlayerNormalised);

      this.newPlayerDuplicate = typeof tmp !== 'undefined';
    }
  }

  handleAddPlayer() {
    if (this.newPlayerDuplicate === false) {
      sendToStore(
        this,
        addNewPlayerAction({
          id: nanoid(),
          name: this.newPlayerGivenName,
          secondName: this.newPlayerFamilyName,
        })
      );
      this.newPlayerGivenName = '';
      this.newPlayerFamilyName = '';
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: render helpers

  renderFilterInput() {
    if (this.allPlayers.length > 5) {
      return html`
      <p>
        <label for="player-filter">Filter:</label>
        <input
          id="player-filter"
          type="search"
          placeholder="enter players name"
          @keyup=${this.handleFilterKeyUp}  />
      </p>`
    }

    return '';
  }

  renderPlayersList() {
    return html`this is the list
      <ul class="list-wrap">
        ${repeat(
          this.filteredPlayers,
          (player) => player.id,
          (player) => html`
          <li class="list-item">
            <label for="player-${player.id}">${player.name} ${player.secondName}</label>
            <button type="button" id="player-${player.id}" value="${player.id}">Edit</button>
          </li>`)}
      </ul>`;
  }

  renderNoPlayers() {
    if (this.players.length === 0) {
      return html`<p>There are no players registered. Please add some players</p>`;
    }

    if (this.filteredPlayers.length === 0 && this.rawFilter.trim() !== '') {
      return html`<p>No players were matched using "${this.rawFilter}"</p>`;
    }
    return '';
  }

  renderDuplicatePlayerMsg() {
    if (this.newPlayerDuplicate === true) {
      return html`<p id="new-player-duplicate-msg">Player "${this.newPlayerGivenName} ${this.newPlayerFamilyName}" already exists in the system. Please choose a different name<p>`;
    }

    return '';
  }

  renderNameField(
    label: string,
    value: string,
    placeholder: string,
    isDupe: boolean,
    handler: Function,
  ) {
    const key = label.toLocaleLowerCase();
    const descByID = (isDupe === true)
    ? 'new-player-duplicate-msg'
    : undefined;
    const fieldID = `players-list-new-player-${key}-name`;

    return html`
      <li class="field-item">
        <label for="${fieldID}">${label} name</label>
        <input
          .aria-describedby=${ifDefined(descByID)}
          id="${fieldID}"
          type="text"
          .value="${value}"
          pattern="^[a-z0-9]+( +[a-z0-9]+)*$"
          placeholder="${placeholder}"
          @keyup=${handler} />
      </li>`;
  }


  renderNewPlayerForm() {
    const pre = 'new-player-btn'
    const btnCls = (this.newPlayerDuplicate === true)
      ? `${pre} ${pre}-error`
      : pre;
    return html`
      <div role="group" arial-labeldby="players-list-new-player-head">
        <h2>New player:</h2>
        <ul class="field-wrap">
          ${this.renderNameField(
            'Given',
            this.newPlayerGivenName,
            'Gabbie',
            this.newPlayerDuplicate,
            this.handleNameKeyUp,
          )}
          ${this.renderNameField(
            'Family',
            this.newPlayerFamilyName,
            'Augustus',
            this.newPlayerDuplicate,
            this.handleNameKeyUp,
          )}
        </ul>

        ${this.renderDuplicatePlayerMsg()}

        <button
          .class="${btnCls}"
          type="button"
          value="add"
          @click=${this.handleAddPlayer}>Add player</button>
      </div>`;
  }

  //  END:  render helpers
  // ------------------------------------------------------
  // START: main render method

  render() {
    this.prepareAllPlayers();

    return html`<section>
      <header>
        <h2>Players</h2>
        ${this.renderFilterInput()}
      </header>
      <main>
        ${(this.filteredPlayers.length > 0)
          ? this.renderPlayersList()
          : this.renderNoPlayers()
        }
      </main>
      <footer>
        ${this.renderNewPlayerForm()}
      </footer>
    </section>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    h2 { margin-bottom: 0.5rem; }
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
    }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'players-list': PlayerList,
  }
}

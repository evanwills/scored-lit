import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  state,
} from 'lit/decorators.js';
import { IIndividualPlayer, ITeam } from '../../types/players';
import { inputHasValue } from '../../type-guards';
import { normaliseName } from '../../utils/general-utils';
// import { sendToStore } from '../../redux/redux-utils';
// import { addNewPlayerAction, updatePlayerAction } from '../../redux/players/players-actions';
// import { getEpre } from '../../utils/general-utils';
// import { nanoid } from 'nanoid';
import {
  renderFilterInput,
  renderNoPlayers,
  // renderPlayerForm,
} from './pure-player-list-renderers';
import { getFilterPlayersByName } from '../../utils/player-utils';
import './player-list-item';
import './player-data-form';
import manageUser from '../../assets/css/manage-user.css';

// const ePre = getEpre('players-list');

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
  filteredPlayers: IIndividualPlayer[] = [];

  @state()
  _normalisedNames : string[] = [];

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
    if (this.players.length !== this._normalisedNames.length) {
      this.filteredPlayers = [...this.players];
      this._normalisedNames = this.players.map((player) => player.normalisedName);
    }
  }

  setFilteredPlayers() {
    this.filteredPlayers = (this.filterStr === '')
        ? [...this.players]
        : this.players.filter(getFilterPlayersByName(this.filterStr));
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

  //  END:  event handlers
  // ------------------------------------------------------
  // START: main render method

  render() {
    this.prepareAllPlayers();
    console.log('Array.isArray(this.filteredPlayers[0]):', Array.isArray(this.filteredPlayers[0]));
    console.log('this.filteredPlayers[0]:', this.filteredPlayers[0]);

    const playerList = (this.filteredPlayers.length > 0)
      ? html`
        <ul class="list-wrap">
            ${this.filteredPlayers.map((player) => html`
          <li class="list-item"><player-list-item
              given-name="${player.name}"
              family-name="${player.secondName}"
              normalised-names=${this._normalisedNames}
              player-id="${player.id}"></player-list-item>
          </li>`)}
        </ul>`
      : renderNoPlayers(
        this.players.length,
        this.filteredPlayers.length,
        this.rawFilter,
        'player'
      );

    return html`<section>
      <header>
        <h2>Players</h2>
      </header>
      ${renderFilterInput(
        this.players.length,
        'Players',
        this.handleFilterKeyUp,
      )}
      ${playerList}
      <footer>
        <player-data-form
          normalised-names=${this._normalisedNames}></player-data-form>
      </footer>
    </section>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = manageUser;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'players-list': PlayerList,
  }
}

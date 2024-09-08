import { css, html, LitElement } from 'lit';
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
import { getEpre } from '../../utils/general-utils';
// import { nanoid } from 'nanoid';
import {
  renderFilterInput,
  renderNoPlayers,
  // renderPlayerForm,
} from './pure-player-list-renderers';
import './player-list-item';
import './player-data-form';


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
  allPlayers: IIndividualPlayer[] = [];

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
    if (this.players.length !== this.allPlayers.length) {
      console.group(ePre('prepareAllPlayers'));
      console.log('this.players:', this.players)
      console.log('this.allPlayers (before):', this.allPlayers)
      console.log('this.filteredPlayers (before):', this.filteredPlayers)
      this.allPlayers = this.players.map((player: IIndividualPlayer) : IIndividualPlayer => {
        return {
          ...player,
          normalisedName: normaliseName(player.name + player.secondName),
        };
      })
      this.filteredPlayers = [...this.allPlayers];
      this._normalisedNames = this.allPlayers.map((player) => player.normalisedName);
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
        this.players,
        this.filteredPlayers,
        this.rawFilter
      );

    return html`<section>
      <header>
        <h2>Players</h2>
        ${renderFilterInput(
          this.allPlayers,
          this.handleFilterKeyUp,
        )}
      </header>
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
    .list-wrap {
      border-top: 0.05rem solid #999;
    }
    .list-item {
      padding: 0.25rem 0;
      border-bottom: 0.05rem solid #999;
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

import { css, html, LitElement } from 'lit';
import {
  customElement,
  property,
  state,
} from 'lit/decorators.js';
import { IIndividualPlayer, IIndividualPlayerFilterable, ITeam } from '../../types/players';
import { inputHasValue } from '../../type-guards';
import { normaliseName } from '../../utils/general-utils';
import { sendToStore } from '../../redux/redux-utils';
import { addNewPlayerAction } from '../../redux/players/players-actions';
import { getEpre } from '../../utils/general-utils';
import { nanoid } from 'nanoid';
import { renderFilterInput, renderNoPlayers, renderPlayerForm, renderPlayersList } from './pure-player-list-renderers';

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

  handleEditPlayer() {
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
  // START: main render method

  render() {
    this.prepareAllPlayers();

    const playerList = (this.filteredPlayers.length > 0)
      ? renderPlayersList(
        this.filteredPlayers,
        this.handleNameKeyUp,
        this.handleEditPlayer,
        this.selecting,
        this.newPlayerDuplicate,
      )
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
      <main>
        ${playerList}
      </main>
      <footer>
        ${renderPlayerForm(
          this.newPlayerGivenName,
          this.newPlayerFamilyName,
          this.newPlayerDuplicate,
          this.handleNameKeyUp,
          this.handleAddPlayer,
        )}
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

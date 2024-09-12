import { html, LitElement, TemplateResult } from 'lit';
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
//   renderPlayerForm,
} from '../manage-players/pure-player-list-renderers';
// import './player-list-item';
// import './player-data-form';
import manageUser from '../../assets/css/manage-user.css';
import { getFilterPlayersByName } from '../../utils/player-utils';


const ePre = getEpre('players-list');

@customElement('teams-list')
export class TeamsList extends LitElement {
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
  filteredTeams: ITeam[] = [];

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

  prepareAllTeams() {
    if (this.teams.length !== this._normalisedNames.length) {
      console.group(ePre('prepareAllTeams'));
      console.log('this.players:', this.players)
      console.log('this.teams:', this.teams)
      console.log('this.filteredTeams (before):', this.filteredTeams)
      this.filteredTeams = [...this.teams];
      this._normalisedNames = this.teams.map((team) => team.normalisedName);
      console.log('this.filteredTeams (after):', this.filteredTeams)
      console.log('this._normalisedNames (after):', this._normalisedNames)
      console.groupEnd();
    }
  }

  setFilteredTeams() {
    this.filteredTeams = (this.filterStr === '')
        ? [...this.teams]
        : this.teams.filter(getFilterPlayersByName(this.filterStr));
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
      this.setFilteredTeams();
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    this.prepareAllTeams();
    console.log('Array.isArray(this.filteredTeams[0]):', Array.isArray(this.filteredTeams[0]));
    console.log('this.filteredTeams[0]:', this.filteredTeams[0]);

    const playerList : TemplateResult|string = (this.filteredTeams.length > 0)
      ? html`
        <ul class="list-wrap">
            ${this.filteredTeams.map((player) => html`
          <li class="list-item"><team-list-item
              teamname="${player.name}"
              members="${player.secondName}"
              normalised-names=${this._normalisedNames}
              player-id="${player.id}"></team-list-item>
          </li>`)}
        </ul>`
      : renderNoPlayers(
        this.teams.length,
        this.filteredTeams.length,
        this.rawFilter,
        'team'
      );

    return html`<section>
      <header>
        <h2>Teams</h2>
        ${renderFilterInput(
          this.teams.length,
          'team',
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

  static styles = manageUser;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'teams-list': TeamsList,
  }
}

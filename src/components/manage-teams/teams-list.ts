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
// import { addnewTeamAction, updatePlayerAction } from '../../redux/players/players-actions';
import { getEpre } from '../../utils/general-utils';
// import { nanoid } from 'nanoid';
import { getFilterPlayersByName } from '../../utils/player-utils';
import {
  renderFilterInput,
  renderNoPlayers,
//   renderPlayerForm,
} from '../manage-players/pure-player-list-renderers';
// import './player-list-item';
// import './player-data-form';
import './team-data-form'
import manageUser from '../../assets/css/manage-user.css';


const ePre = getEpre('teams-list');

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
  newTeamName: string = '';

  @state()
  newTeamNormalised: string = '';

  @state()
  newTeamDuplicate: boolean = false;

  //  END:  state
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() {
    console.group(ePre('connectedCallback'));
    super.connectedCallback()

    console.log('this._normalisedNames (before):', this._normalisedNames);

    this._normalisedNames = this.teams.map((team): string => team.normalisedName);

    console.log('this._normalisedNames (after):', this._normalisedNames);

    console.groupEnd();
  }

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
    console.group(ePre('setFilteredTeams'));
    console.log('this.filteredTeams (before):', this.filteredTeams);
    console.log('this.filterStr:', this.filterStr);
    this.filteredTeams = (this.filterStr === '')
      ? [...this.teams]
      : this.teams.filter(getFilterPlayersByName(this.filterStr));
    console.log('this.filteredTeams (after):', this.filteredTeams);
    console.groupEnd();
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
    console.group(ePre('render'));
    this.prepareAllTeams();
    console.log('Array.isArray(this.filteredTeams[0]):', Array.isArray(this.filteredTeams[0]));
    console.log('this.filteredTeams[0]:', this.filteredTeams[0]);
    const playerList : TemplateResult|string = (this.filteredTeams.length > 0)
      ? html`
          <ul class="list-wrap">
            ${this.filteredTeams.map((team) => html`
              <li class="list-item">
                <team-list-item
                  teamname="${team.name}"
                  members="${team.members}"
                  normalisednames=${this._normalisedNames}
                  teamid="${team.id}"></team-list-item>
              </li>`)}
          </ul>`
      : renderNoPlayers(
          this.teams.length,
          this.filteredTeams.length,
          this.rawFilter,
          'team'
        );

    console.log('this.players:', this.players);
    console.log('this.teams:', this.teams);
    console.log('this._normalisedNames:', this._normalisedNames);
    console.groupEnd();
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
        <team-data-form
          .allplayers=${this.players}
          .allteams=${this.teams}
          .normalisednames=${this._normalisedNames}></team-data-form>
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

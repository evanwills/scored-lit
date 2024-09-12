import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
// import { TGameType, TGameTypes } from "../../types/custom-redux-types";
// import { ifDefined } from "lit/directives/if-defined.js";
// import { sendToStore } from "../../redux/redux-utils";
// import { addNewGameAction } from "../../redux/currentGame/current-actions";
import { IIndividualPlayer, IPlayer, ITeam } from "../../types/players";
import { filterPlayersByIDs, getFilterPlayersByName, getPlayerByID } from "../../utils/player-utils";
import { repeat } from "lit/directives/repeat.js";
import { getEpre } from "../../utils/general-utils";

// const optionLoopItem = (id: string) => (item : TGameType) => {
//   const selected = (id === item.id)
//     ? true
//     : undefined;

//   return html`
//     <option value="${item.id}" ?selected="${ifDefined(selected)}">
//       ${item.name}
//     </option>`;
// };

// eslint-disable-next-line no-unused-vars
const ePre = getEpre('select-type');

@customElement('select-players')
export class SelectPlayers extends LitElement {
  @property({ type: Array })
  allplayers: IIndividualPlayer[] = [];

  @property({ type: Array })
  allteams: ITeam[] = [];

  @property({ type: Array })
  selectedPlayers : IPlayer[] = [];

  @property({ type: Boolean })
  isteam: boolean = false;

  @state()
  _selectedPlayers : IPlayer[] = [];

  @state()
  _playerIDs : string[] = [];

  @state()
  _playerFilter : string = '';

  handlePlayerSelect(event: InputEvent) {
  };

  handleConfirmPlayers() {
  };

  renderPlayers() : TemplateResult {
    let playerList = filterPlayersByIDs(this.allplayers, this._playerIDs);

    if (this._playerFilter.trim() !== '') {
      playerList = playerList.filter(
        getFilterPlayersByName(this._playerFilter),
      );
    }
    console.group(ePre('renderPlayers'));
    console.log('this.allplayers:', this.allplayers);
    console.log('playerList:', playerList);
    console.groupEnd();

    return repeat(
      playerList,
      (player : IIndividualPlayer) : string => player.id,
      (player : IIndividualPlayer) : TemplateResult => {
        const id = `team-${player.id}`;
        return html`<li>
          <input id="${id}" type="checkbox" value="${player.id}" />
          <label for="${id}">
            ${player.name} ${player.secondName}
          </label>
        </li>`;
      }
    );
  }

  renderTeamMembers(team: ITeam) {
    return team.members.map((playerID) => {
      const player = getPlayerByID(this.allplayers, playerID);

      return html`<li>
        ${(player !== null)
          ? `${player.name} ${player.secondName}`
          : 'Unkown player'}
        </li>`;
    });
  }

  renderTeams() : TemplateResult {
    console.group(ePre('renderTeams'));
    console.log('this:', this);
    console.log('this.allteams:', this.allteams);
    console.groupEnd();
    if (this.allteams.length === 0) {
      return html`<p>No teams available</p>`;
    }

    let playerList = filterPlayersByIDs(this.allteams, this._playerIDs);

    if (this._playerFilter.trim() !== '') {
      playerList = playerList.filter(
        getFilterPlayersByName(this._playerFilter),
      );
    }

    return repeat(
      playerList,
      (team : ITeam) : string => team.id,
      (team : ITeam) : TemplateResult => {
        const id = `team-${team.id}`;
        return html`
          <li>
            <input id="${id}" type="checkbox" value="${team.id}" />
            <label for="${id}">
              ${team.name}
            </label>
            <ul>
              ${this.renderTeamMembers(team)}
            </ul>
          </li>`;
      }
    );
  }

  render() {
    const list = (this.isteam === true)
      ? this.renderTeams()
      : this.renderPlayers();

    console.group(ePre('render'));
    console.log('this:', this);
    console.log('this.allteams:', this.allteams);
    console.log('this.isteam:', this.isteam);
    // console.log('this.renderTeams():', this.renderTeams());
    console.log('list:', list);
    console.groupEnd();
    return html`
      <form aria-labeledby="select-players-form">
        <h2>
          Select ${(this.isteam === true) ? 'teams' : 'players'}
        </h2>

        <ul>
          ${list}
        </ul>
      </form>`
  };


  static styles = css`
    .label {
      white-space: wrap;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'select-players': SelectPlayers,
  }
}


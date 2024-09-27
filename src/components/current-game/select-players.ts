import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
// import { TGameType, TGameTypes } from "../../types/custom-redux-types";
// import { ifDefined } from "lit/directives/if-defined.js";
// import { sendToStore } from "../../redux/redux-utils";
// import { addNewGameAction } from "../../redux/currentGame/current-actions";
import { IIndividualPlayer, IPlayer, ITeam } from "../../types/players";
import { filterPlayersByIDs, getFilterPlayersByName, getPlayerByID } from "../../utils/player-utils";
import { getEpre, normaliseName } from "../../utils/general-utils";
import { inputHasValue } from "../../type-guards";
import { playerCheckboxItem, renderNameField, teamCheckboxItem } from "../manage-players/pure-player-list-renderers";

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
const ePre = getEpre('select-players');

@customElement('select-players')
export class SelectPlayers extends LitElement {
  @property({ type: Array })
  allplayers: IIndividualPlayer[] = [];

  @property({ type: Array })
  allteams: ITeam[] = [];

  @property({ type: Boolean })
  isteam: boolean = false;

  @property({ type: Number })
  max: number = 0;

  @property({ type: Number })
  min: number = 0;

  @property({ type: Array })
  selectedplayers : string[] = [];

  @property({ type: String })
  refid : string = '';

  @state()
  _selectedPlayers : IPlayer[] = [];

  @state()
  _playerIDs : string[] = [];

  @state()
  _playerFilter : string = '';

  @state()
  _showFilter : boolean = false;

  //  END:  state
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() {
    super.connectedCallback();
    // console.group(ePre('connectedCallback'));
    // console.log('this:', this);
    // console.log('this.refid:', this.refid);
    // console.log('this.allteams:', this.allteams);
    // console.log('this.allplayers:', this.allplayers);
    // console.log('this.selectedplayers:', this.selectedplayers);
    // console.log('this.isteam:', this.isteam);
    // console.log('this._selectedPlayers:', this._selectedPlayers);

    this._playerIDs = this.selectedplayers;
    this._showFilter = (this.isteam)
      ? (this.allteams.length > 7)
      : (this.allplayers.length > 7);

    // console.log('this._playerIDs:', this._playerIDs);
    // console.log('this._playerFilter:', this._playerFilter);
    // console.groupEnd();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: sub-render method

  handleFilterKeyup(event: InputEvent) {
    // console.group(ePre('handleFilterKeyup'));

    if (typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      // console.log('event.target:', event.target);
      this._playerFilter = normaliseName(event.target.value);
      // console.log('value:', value);
    }
    // console.groupEnd();
  }


  handlePlayerSelect(event: InputEvent) {
    // console.group(ePre('handlePlayerSelect'));

    if (typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      // console.log('event.target:', event.target);
      const isChecked = event.target.checked === true;
      const value = event.target.value;
      // console.log('value:', value);
      let go = false;
      const tmp = getPlayerByID(this.allplayers, value);
      // console.log('tmp:', tmp);

      if (tmp !== null) {
        const i = this._playerIDs.indexOf(value);
        if (isChecked === true) {
          if (i === -1) {
            go = true;
            this._playerIDs.push(value);
            this._selectedPlayers.push(tmp);
          }
        } else {
          if (i >= 0) {
            go = true;
            this._playerIDs = this._playerIDs.filter((id : string) : boolean => id !== value);
            this._selectedPlayers = this._selectedPlayers.filter(
              (player: IPlayer) : boolean => (player.id !== value),
            );
          }
        }
      }

      if (go === true) {
        console.log('this._playerIDs:', this._playerIDs);
        console.log('this._selectedPlayers:', this._selectedPlayers);

        this.dispatchEvent(
          new CustomEvent(
            'playerselected',
            {
              detail: {
                IDs: this._playerIDs,
                players: this._selectedPlayers,
              },
            },
          ),
        );

        // ----------------------------------------------
        // START: player count validation

        const idLen = this._playerIDs.length
        let detail = '';

        if (this.min > 0 && idLen < this.min) {
          detail = 'Please select more players. '
            + `You need to select at least ${this.min} players`;
        } else if (this.max > 0 && idLen > this.max) {
          detail = 'Too many players selected. '
            + `You can have up to ${this.max} players selected`;
        }

        if (detail !== '') {
          this.dispatchEvent(new CustomEvent(
            'playerselectederror',
            { detail },
          ));
        }

        //  END:  player count validation
        // ----------------------------------------------
      } else {
        console.error(
          `${ePre('handleFilterKeyup')}could not find player matching ID: ${value}`,
        );
      }
    }
    // console.log('this._playerIDs:', this._playerIDs);
    // console.log('this._selectedPlayers:', this._selectedPlayers);
    // console.groupEnd();
  };

  handleConfirmPlayers() {
  };

  // renderPlayers() : TemplateResult[] {
  renderPlayers() : unknown {
    // console.group(ePre('renderPlayers'));
    // console.log('this.allplayers:', this.allplayers);
    // let playerList = (this._playerIDs.length > 0)
    //   ? filterPlayersByIDs(this.allplayers, this._playerIDs)
    //   : [...this.allplayers];

    let playerList = [...this.allplayers];

    if (this._playerFilter.trim() !== '') {
      playerList = playerList.filter(
        getFilterPlayersByName(this._playerFilter),
      );
    }
    // console.log('playerList:', playerList);
    // console.groupEnd();

    // return playerList.map(playerCheckboxItem);

    return repeat(
      playerList,
      (player : IIndividualPlayer) : string => player.id,
      playerCheckboxItem(this._playerIDs),
    );
  }

  renderTeams() : unknown {
    // console.group(ePre('renderTeams'));
    // console.log('this:', this);
    // console.log('this.allteams:', this.allteams);
    // console.log('this.allplayers:', this.allplayers);
    // console.groupEnd();
    if (this.allteams.length === 0) {
      return html`<p>No teams available</p>`;
    }

    let playerList = filterPlayersByIDs(this.allteams, this._playerIDs);

    return repeat(
      playerList,
      (team : ITeam) : string => team.id,
      teamCheckboxItem(this.allplayers)
    );
  }

  //  END:  sub-render method
  // ------------------------------------------------------
  // START: main render method


  render() : TemplateResult {
    const list : unknown = (this.isteam === true)
      ? this.renderTeams()
      : this.renderPlayers();

    const placeholder = (this.isteam === true)
      ? 'A Team'
      : 'Lu Smith';

    // console.group(ePre('render'));
    // console.log('this:', this);
    // console.log('list:', list);
    // console.log('this.allteams:', this.allteams);
    // console.log('this.refid:', this.refid);
    // console.log('this.allplayers:', this.allplayers);
    // console.log('this.isteam:', this.isteam);
    // console.log('this._playerIDs:', this._playerIDs);
    // console.log('this.renderTeams():', this.renderTeams());
    // console.log('list:', list);
    // console.groupEnd();

    let heading = 'Select '
    heading += (this.isteam === true)
      ? 'teams'
      : 'players';

    return html`
      <form aria-labeledby="select-players-form">
        ${(this.refid !== '')
          ? html`<h4>${heading}</h4>`
          : html`<h3>${heading}</h3>`
        }

        <ul>
          ${(this._showFilter === true)
            ? renderNameField(
                'selectPlayerFilter',
                'Filter players',
                '',
                '',
                placeholder,
                false,
                this.handleFilterKeyup,
                (this.isteam === true)
                  ? 'general'
                  : 'family',
              )
            : ''
          }
        </ul>

        <ul @change=${this.handlePlayerSelect} class="player-list">
          ${list}
        </ul>
      </form>`
  };


  static styles = css`
    .label {
      white-space: wrap;
    }
    h3, h4 {
      margin: 0.5rem 0 0;
    }
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    li {
      margin: 0;
      padding: 0.25rem 0.5rem;
      display: flex;
      column-gap: 0.5rem;
      border-radius: 0.25rem;
    }
    li:hover, li:focus-within {
      outline: 0.05rem solid #fff;
      outline-offset: 0.1rem;
      cursor: pointer;
    }
    li:first-child {
      margin-top: 0;
    }
    li:last-child {
      margin-bottom: 0;
    }
    input:hover, label:hover {
      cursor: pointer;
    }
    .player-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-bottom: 1rem;
    }
    .player-list li {
      flex-grow: 1;
      width: 9.15rem;
    }
    .player-list li > label {
      flex-grow: 1;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'select-players': SelectPlayers,
  }
}


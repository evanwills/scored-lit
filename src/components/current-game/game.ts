import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TGameType, TGameTypes } from '../../types/custom-redux-types';
import { EGameStates, TGameData } from '../../types/game-data.d'
import './select-type';
import { IIndividualPlayer, ITeam } from '../../types/players';
import { inputHasValue } from '../../type-guards';
import { sendToStore } from '../../redux/redux-utils';
import {
  addNewGame,
  restartGame,
  restartNewPlayers,
  // setGameMode,
} from '../../redux/currentGame/current-actions';
import { EAppStates, setAppState } from '../../redux/app-state';
// import { getEpre } from '../../utils/general-utils';

// const ePre = getEpre('current-game');

@customElement('current-game')
export class CurrentGame extends LitElement {
  @property({ type: Array })
  types: TGameTypes = [];

  @property({ type: Array })
  rules: TGameTypes = [];

  @property({ type: Object })
  data: TGameData = {
    end: null,
    forced: false,
    id: '',
    lead: null,
    looser: null,
    mode: EGameStates.SET_TYPE,
    players: [],
    scores: [],
    start: '',
    teams: false,
    type: '',
    winner: null,
  };

  @property({ type: Array })
  players: Array<IIndividualPlayer> = [];

  @property({ type: Array })
  teams: Array<ITeam> = [];

  @property({ type: Array })
  pastGames: Array<TGameData> = [];

  @state()
  canResume: boolean = false;

  @state()
  resumeSet: boolean = false;

  @state()
  showGameTypeSelect: boolean = false;

  // handleTypeSelect(event: InputEvent) {
  // };

  nextGame() {
    return html`
      <p class="play-again play-again--after">
        <button type="button" value="playagain" @click=${this.dispatch}>
          Play again
        </button>
        <button type="button" value="playagaindiff" @click=${this.dispatch}>
          Play again with different players
        </button>
        <button type="button" value="playdiff" @click=${this.dispatch}>
          Play a different game
        </button>
        ${(this.canResume === true)
          ? html`
            <button type="button" value="resume" @click=${this.dispatch}>
              Resume an interrupted game
            </button>`
          : ''
        }
      </p>`;
  };

  dispatch(event: InputEvent) {
    if (event.target !== null && inputHasValue(event.target)) {

      switch (event.target.value) {
        case 'playagain':
          // @TODO Do some sanity checking to make sure it's OK to
          //       start a new game
          sendToStore(this, restartGame(null));
          break;

          case 'playagaindiff':
            // @TODO Do some sanity checking to make sure it's OK to
            //       start a new game
            sendToStore(this, restartNewPlayers(null));
            break;

          case 'playdiff':
            // @TODO Do some sanity checking to make sure it's OK to
            //       start a new game
            sendToStore(this, restartNewPlayers(null));
            break;

          case 'resume':
            // @TODO Do some sanity checking to make sure it's OK to
            //       start a new game
            sendToStore(
              this,
              setAppState(EAppStates.interuptedGames),
            );
            break;

        case 'settype':
          this.showGameTypeSelect = true;
          break;

        default:
          throw new Error(`Unknown event: "${event.type}". Value: ${event.detail.toString()}`);
      }
    }
    console.groupEnd();
  };

  handleTypeConfirmed(event: CustomEvent) {
    this.showGameTypeSelect = false;
    sendToStore(this, addNewGame(event.detail))
  }

  renderGameTypeSelect() {
    const id = (this.data !== null)
      ?  this.data.type
      : '';

    const types = this.types.map((rule) : TGameType => ({
      id: rule.id,
      name: rule.name,
      description: '',
    }));

    return html`
      <select-game-type
        .last-type="${id}"
        .types="${types}"
        @typeconfirmed=${this.handleTypeConfirmed}></select-game-type>`;
  }

  render() {
    if (this.resumeSet === false) {
      this.canResume = this.pastGames.find((past : TGameData) => (past.forced === true))
        ? true
        : false;
      this.resumeSet = true;
    }
    if (this.data === null) {
      return html`
        <p class="play-again play-again--before">
          ${(this.showGameTypeSelect)
            ? this.renderGameTypeSelect()
            : html`<button type="button" value="settype" @click=${this.dispatch}>Choose a game</button>`
          }

          ${(this.canResume === true)
            ? html`
              <button type="button" value="resume" @click=${this.dispatch}>
                Resume an interrupted game
              </button>`
            : ''
          }
        </p>`;
    }

    if (this.data.mode === EGameStates.ADD_PLAYERS) {
      return html`
        <select-players
          .all-players=${this.players}
          .all-teams=${this.teams}
          .selected-players=${this.data.players}
          @setplayers=${this.dispatch}
          @addplayers=${this.dispatch}
          @addteam=${this.dispatch}
          @removeplayer=${this.dispatch}
          @removeteam=${this.dispatch}
          ?use-teams=${this.data.teams}></select-players>
      `;
    }

    const ended = (this.data.mode === EGameStates.GAME_OVER)
      ? this.nextGame()
      : '';

    const rules = this.rules.find((rule) => rule.id === this.data.type);

    if (typeof rules !== 'undefined') {
      throw new Error(`Could not find rules for game: "${this.data.type}".`);
    }

    return html`
      <play-game
        .data=${this.data}
        .rules=${rules}
        @interrupt=${this.dispatch}
        @setscore=${this.dispatch}
        @setlead=${this.dispatch}
        @updatescore=${this.dispatch}
        @updatelead=${this.dispatch}></play-game>
      ${ended}`;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'current-game': CurrentGame,
  }
}

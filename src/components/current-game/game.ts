import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TGameType, TGameTypes } from '../../types/custom-redux-types';
import { EGameStates, TGameData } from '../../types/game-data.d'
import './select-type';
import { IIndividualPlayer, ITeam } from '../../types/players';
import { inputHasValue } from '../../type-guards';


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

  // handleTypeSelect(event: InputEvent) {
  // };

  nextGame() {
    return html`
      <p class="play-again play-again--after">
        <button type="button" value="playagain" @click=${this.dispatch}>PLay again</button>
        <button type="button" value="playagaindiff" @click=${this.dispatch}>PLay again with different players</button>
        <button type="button" value="playdiff" @click=${this.dispatch}>PLay a different game</button>
        <button type="button" value="resume" @click=${this.dispatch}>Resume an interrupted game</button>
      </p>`;
  };

  dispatch(event: InputEvent) {
    if (event.target !== null && inputHasValue(event.target)) {
      switch (event.target.value) {
        case 'setgametype':
          if (this.data.mode !== EGameStates.SET_TYPE) {
            throw new Error(`Cannot set game type when game is in "${this.data.mode}"`)
          }

          // dispatch redux action
          break;

        default:
          throw new Error(`Unknown event: "${event.type}". Value: ${event.detail.toString()}`);
      }
    }
  };

  render() {
    if (this.data === null) {
      return html`
        <p class="play-again play-again--before">
          <button type="button" value="settype" @click=${this.dispatch}>Choose a game</button>
          <button type="button" value="resume" @click=${this.dispatch}>Resume an interrupted game</button>
        </p>`;
    }

    if (this.data.mode === EGameStates.SET_TYPE) {
      const id = (this.data !== null)
        ?  this.data.type
        : '';
      const types = this.rules.map((rule) : TGameType => ({
        id: rule.id,
        name: rule.name,
        description: '',
      }));

      return html`
        <select-game-type
          .last-type="${id}"
          @setgametype=${this.dispatch}
          .types="${types}"></select-game-type>`;
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

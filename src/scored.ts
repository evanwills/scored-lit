import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { connect } from 'pwa-helpers';
import { store } from './redux/store';
import { EGameStates, TGameData, TScoredStore } from './types/game-data.d';
import { IGameRuleData } from './types/game-rules.d';
import { IIndividualPlayer, ITeam } from './types/players.d';
// import { getEpre } from './utils/general-utils';
import { addNewGame, forceEndGame, selectGameToResume } from './redux/currentGame/current-actions';

// const ePre = getEpre('scored');

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('score-cards')
export class ScoreCards extends connect(store)(LitElement) {
  @state()
  currentGame : TGameData|null = null;

  @state()
  customGames: Array<IGameRuleData> = [];

  @state()
  pastGames: Array<TGameData> = [];

  @state()
  players: Array<IIndividualPlayer> = [];

  @state()
  teams: Array<ITeam> = [];

  @state()
  restarters: number = 0;

  @state()
  gameState: EGameStates|null = null;

  stateChanged(state : TScoredStore) {
    this.currentGame = state.currentGame;
    this.customGames = state.customGames;
    this.pastGames = state.pastGames;
    this.players = state.players;
    this.teams = state.teams;

    const tmp = this.pastGames.filter(game => game.forced === true);
    this.restarters = tmp.length;

    this.gameState = (this.currentGame !== null)
      ? this.currentGame.mode
      : null;
  };

  handleClick(event : Event) {
    if (typeof event.target !== 'undefined' && event.target !== null) {
      switch ((event.target as HTMLButtonElement).value) {
        case 'start':
          // addNewGame({ id: 'new', start: new Date().toISOString() });
          store.dispatch(
            addNewGame({ id: 'new', start: new Date().toISOString() }),
          );
          break;

        case 'end':
          store.dispatch(forceEndGame('force'));
          break;
        case 'resume':
          store.dispatch(selectGameToResume(null));
      }
    }
  };

  render() {
    return html`
      <div class="score-card">
        <h1>Scored</h1>
        <p>Keep score for your favourite games</p>

        <p>
          ${(this.currentGame === null)
            ? html`
              <button type="button" value="start" @click=${this.handleClick}>Start new game</button>
              ${(this.restarters > 0)
                ? html`<button type="button" value="resume" @click=${this.handleClick}>Resume interrupted game</button>`
                : ''
              }`
            : ''
          }
          ${(this.gameState === EGameStates.PLAYING) ? html`<button type="button" value="end" @click=${this.handleClick}>End game</button>` : ''}
        </p>
      </div>
    `
  }

  static styles = css`
    .score-card {
      padding: 1rem 1.5rem;
      border: 0.05rem solid #fff;
    }
    h1 {
      margin: 0 0 1rem;
    }
    p {
      margin: 0 0 1rem;
    }
    .score-card *:last-child {
      margin-bottom: 0.5rem;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'score-cards': ScoreCards,
  }
}

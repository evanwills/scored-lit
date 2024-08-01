import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { connect } from 'pwa-helpers';
import { store } from './redux/store';
import { EGameStates, TGameData, TScoredStore } from './types/game-data.d';
import { IGameRuleData } from './types/game-rules.d';
import { IIndividualPlayer, ITeam } from './types/players.d';
import { getEpre } from './utils/general-utils';
import { selectGameToResume } from './redux/currentGame/current-actions';
import { sendToStore } from './redux/redux-utils';
import { EAppStates, setAppState } from './redux/app-state';
import './components/current-game/game';
import { TAppRoute } from './types/general';
import { inputHasValue, linkHasHref } from './type-guards';

const ePre = getEpre('scored');
const routes : TAppRoute[] = [
  { anchor: 'game', label: 'Keep score', icon: '' },
  { anchor: 'players', label: 'Manage players', icon: '' },
  { anchor: 'teams', label: 'Manage teams', icon: '' },
  { anchor: 'pastGames', label: 'View past games', icon: '' },
]

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

  private navDialog : HTMLDialogElement|null = null;

  // connectedCallback() {
  //   console.group(ePre('connectedCallback'));
  //   super.connectedCallback()

  //   console.log('store:', store);
  //   console.log('store.getState():', store.getState());
  //   console.groupEnd();
  // }

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

  handleLinkClick(event: Event) {
    if (this.navDialog !== null
      && typeof event.target !== 'undefined'
      && event.target !== null
      && linkHasHref(event.target)
    ) {
      const anchor = event.target.href.replace(/^.*?#([a-z]+).*$/i, '$1');

      sendToStore(this, setAppState(anchor));
    }
  }

  toggleNav(event: InputEvent) {
    if (this.navDialog === null) {
      if (this.shadowRoot !== null) {
        const tmp = this.shadowRoot.querySelector('#nav-menu');
        if (typeof tmp !== 'undefined') {
          this.navDialog = tmp as HTMLDialogElement;
        }
      }
    }

    if (this.navDialog !== null
      && typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      if (event.target.value === 'open' && this.navDialog.open === false) {
        this.navDialog.showModal();
      } else if (event.target.value === 'close' && this.navDialog.open === true) {
        this.navDialog.close();
      }
    }
  }

  handleClick(event : Event) {
    if (typeof event.target !== 'undefined' && event.target !== null) {
      switch ((event.target as HTMLButtonElement).value) {
        case 'resume':
          // store.dispatch(selectGameToResume(null));
          sendToStore(this, selectGameToResume(null));
      }
    }
  };

  // sendToRedux(event : CustomEvent) {
  //   // console.group(ePre('sendToRedux'));
  //   // console.log('event.type:', event.type);
  //   // console.log('event.detail:', event.detail);
  //   store.dispatch(event.detail);
  //   // console.groupEnd();
  // }

  renderNavLink({ anchor, label } : TAppRoute) : TemplateResult {
    return html`
      <li>
        <a href="#${anchor}" @click=${this.handleLinkClick}>
          ${label}
        </a>
      </li>`;
  }

  render() {
    let view : TemplateResult|string = '';

    const _state = store.getState();

    switch (_state.appState) {
      case EAppStates.game:
        view = html`<current-game
          .types=${_state.gameTypes}
          .data=${_state.currentGame}
          .players=${_state.players}
          .teams=${_state.teams}
          .pastGames=${_state.pastGames}></current-game>`;
        break;
    }

    return html`
      <div class="score-card">
        <header>
          <h1>Scored</h1>
          <p>Keep score for your favourite games</p>
          <nav>
            <button
              class="menu-toggle menu-toggle--open"
              id="open-menu"
              type="button"
              value="open"
              @click=${this.toggleNav}>
              Open Menu
            </button>
            <dialog id="nav-menu">
              <ul>
                ${routes.map((route) => this.renderNavLink(route))}
              </ul>
            <button
              class="menu-toggle menu-toggle--close"
              type="button"
              value="close"
              id="close-menu"
              @click=${this.toggleNav}>
              Close Menu
            </button>
          </nav>
        </header>
        ${view}
      </div>
    `
  }

  static styles = css`
    .score-card {
      padding: 1rem 1.5rem;
      border: 0.05rem solid #fff;
      position: relative;
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
    .score-card  .menu-toggle {
      position: absolute;
      top: 0;
      right: 0;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'score-cards': ScoreCards,
  }
}

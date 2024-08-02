import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { connect } from 'pwa-helpers';
import { store } from './redux/store';
import { EGameStates, TGameData, TScoredStore } from './types/game-data.d';
import { IGameRuleData } from './types/game-rules.d';
import { IIndividualPlayer, ITeam } from './types/players.d';
// import { getEpre } from './utils/general-utils';
import { selectGameToResume } from './redux/currentGame/current-actions';
import { sendToStore } from './redux/redux-utils';
import { EAppStates, setAppState } from './redux/app-state';
import { TAppRoute } from './types/general';
import { inputHasValue, linkHasHref } from './type-guards';
import './components/current-game/game';

// const ePre = getEpre('scored');
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

  toggleNav(action: string) {
    if (this.navDialog === null) {
      if (this.shadowRoot !== null) {
        const tmp = this.shadowRoot.querySelector('#nav-menu');
        if (typeof tmp !== 'undefined') {
          this.navDialog = tmp as HTMLDialogElement;
        }
      }
    }

    if (this.navDialog !== null) {
      if (action === 'open' && this.navDialog.open === false) {
        this.navDialog.showModal();
      } else if (action === 'close' && this.navDialog.open === true) {
        this.navDialog.close();
      }
    }
  }

  handleLinkClick(event: Event) {
    if (this.navDialog !== null
      && typeof event.target !== 'undefined'
      && event.target !== null
      && linkHasHref(event.target)
    ) {
      const anchor = event.target.href.replace(/^.*?#([a-z]+).*$/i, '$1');

      sendToStore(this, setAppState(anchor));
      this.toggleNav('close');
    }
  }

  handleNavBtnClick(event: InputEvent) {
    if (typeof event.target !== 'undefined'
      && event.target !== null
      && inputHasValue(event.target)
    ) {
      this.toggleNav(event.target.value);
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
              @click=${this.handleNavBtnClick}>
              Open Menu
            </button>
            <dialog id="nav-menu">
              <label for="close-menu" class="close-menu-background">Close menu</label>
              <div class="nav-wrap">
                <ul class="nav-menu-list">
                  ${routes.map((route) => this.renderNavLink(route))}
                </ul>
                <button
                  class="menu-toggle menu-toggle--close"
                  type="button"
                  value="close"
                  id="close-menu"
                  @click=${this.handleNavBtnClick}>
                  Close Menu
                </button>
              </div>
            </dialog>
          </nav>
        </header>
        ${view}
      </div>
    `
  }

  static styles = css`
    .score-card {
      border: 0.05rem solid #fff;
      border-radius: 0.3rem;
      padding: 0.5rem 1.5rem 0.75rem;
      position: relative;
    }
    h1 {
      margin: 0 0 .25rem;
    }
    p {
      margin: 0 0 1rem;
    }
    .score-card *:last-child:not(dialog, a) {
      margin-bottom: 0.5rem;
    }
    .score-card nav {
      position: absolute;
      top: 0;
      right: 0;
    }
    .score-card dialog {
      box-sizing: border-box;
      position: relative;
      border: 0.05rem solid #fff;
      padding: 1rem 0;
      border-radius: 0.3rem;
    }
    .score-card dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }
    .score-card .menu-toggle {
      display: block;
      height: 2rem;
      line-height: 5rem;
      overflow: hidden;
      position: absolute;
      right: 0;
      width: 2rem;
    }
    .score-card .menu-toggle:hover {
      cursor: pointer;
    }
    .score-card .menu-toggle::before,
    .score-card .menu-toggle::after {
      border-color: #fff;
      border-style: solid;
      border-left: none;
      border-right: none;
      content: '';
      display: block;
      position: absolute;
      right: 50%;
      text-indent: 0.1rem;
      top: 50%;
      width: 1rem;
      transform: translate(50%, -50%);
    }
    .score-card .menu-toggle--open {
      top: 0;
    }
    .score-card .menu-toggle--open::before {
      border-bottom-width: 0.1rem;
      border-top-width: 0.1rem;
      height: 0.75rem;
    }
    .score-card .menu-toggle--open::after {
      border-top-width: 0.1rem;
      border-bottom: none;
      height: 0.1rem;
      margin-top: 0.05rem;
    }
    .score-card .menu-toggle--close {
      top: -1rem;
    }
    .score-card .menu-toggle--close::before,
    .score-card .menu-toggle--close::after {
      border-top-width: 0.1rem;
      border-bottom: none;
      content: '';
      display: block;
      position: absolute;
      right: 50%;
      text-indent: 0.1rem;
      top: 50%;
      width: 1rem;
    }
    .score-card .menu-toggle--close::before {
      transform: translate(50%, -50%) rotate(-45deg);
    }
    .score-card .menu-toggle--close::after {
      transform: translate(50%, -50%) rotate(45deg);
    }
    .nav-menu-list {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
    .nav-menu-list li {
      margin: 0;
      padding: 0;
    }
    .nav-menu-list a {
      display: block;
      width: 100%;
      padding: 0.4rem 1rem;
      margin: 0;
    }
    .nav-wrap {
      position: relative;
      z-index: 1;
    }
    .close-menu-background {
      bottom: 0;
      color: transparent;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'score-cards': ScoreCards,
  }
}

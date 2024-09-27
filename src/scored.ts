import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { connect } from 'pwa-helpers';
import { store } from './redux/store';
import { EGameStates, TGameData, TScoredStore } from './types/game-data.d';
import { IGameRuleData } from './types/game-rules.d';
import { IIndividualPlayer, ITeam } from './types/players.d';
import { selectGameToResumeAction } from './redux/currentGame/current-actions';
import { sendToStore } from './redux/redux-utils';
import { EAppStates, setAppState } from './redux/app-state';
import { TAppRoute } from './types/general';
import { inputHasValue, linkHasHref } from './type-guards';
import { getEpre } from './utils/general-utils';
import './components/current-game/game';
import './components/manage-players/player-list';
import './components/manage-teams/teams-list';
import './components/app-header'

const ePre = getEpre('scored');

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('score-cards')
export class ScoreCards extends connect(store)(LitElement) {
  // ------------------------------------------------------
  // START: props

  //  END:  props
  // ------------------------------------------------------
  // START: state
  @state()
  currentGame : TGameData|null = null;

  @state()
  customGames: IGameRuleData[] = [];

  @state()
  pastGames: TGameData[] = [];

  @state()
  players: IIndividualPlayer[] = [];

  @state()
  teams: ITeam[] = [];

  @state()
  restarters: number = 0;

  @state()
  gameState: EGameStates|null = null;

  @state()
  gameTypes: IGameRuleData[] = [];

  @state()
  appState: EAppStates = EAppStates.game;

  @state()
  darkMode: boolean|null = null;

  @state()
  fontSizeAdjust: number = 0;

  @state()
  firstTime: boolean = true;

  private navDialog : HTMLDialogElement|null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: lifecycle methods

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
    this.gameTypes = state.gameTypes;
    this.players = state.players;
    // this.joinPlayerGame = [];
    // this.joinPlayerTeam = [];
    this.teams = state.teams;
    this.appState = state.appState;

    const tmp = this.pastGames.filter(game => game.forced === true);
    this.restarters = tmp.length;

    this.gameState = (this.currentGame !== null)
      ? this.currentGame.mode
      : null;
  };

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper methods

  presetView() {
    if (this.firstTime === true) {
      this.firstTime = false;
      const tmp = window.location.hash.substring(1);
      if (this.appState !== tmp) {
        sendToStore(this, setAppState(tmp));
      }
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

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
          sendToStore(this, selectGameToResumeAction(null));
      }
    }
  };

  //  END:  event handlers
  // ------------------------------------------------------
  // START: render helpers

  renderNavLink({ anchor, label } : TAppRoute) : TemplateResult {
    return html`
      <li>
        <a href="#${anchor}" @click=${this.handleLinkClick}>
          ${label}
        </a>
      </li>`;
  }

  renderView() : TemplateResult|string {
    console.group(ePre('renderView'));
    console.log('this.teams:', this.teams);
    console.groupEnd();
    switch (this.appState) {
      case EAppStates.game:
        return html`<current-game
          .types=${this.gameTypes}
          .data=${this.currentGame}
          .players=${this.players}
          .teams=${this.teams}
          .pastGames=${this.pastGames}></current-game>`;

      case EAppStates.players:
        return html`<players-list
          .players=${this.players}
          .teams=${this.teams}></players-list>`;

      case EAppStates.teams:
        return html`<teams-list
          .players=${this.players}
          .teams=${this.teams}></teams-list>`;

      default:
        return '';
    }
  }

  //  END:  render helpers
  // ------------------------------------------------------
  // START: main render method

  render() {
    this.presetView();

    return html`
      <div class="score-card">
        <app-header></app-header>
        <main>
          ${this.renderView()}
        </main>
      </div>
    `
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    .score-card {
      border: 0.05rem solid #fff;
      border-radius: 0.3rem;
      padding: 1em 1.5rem 1.5rem;
      position: relative;
    }
    p {
      margin: 0;
    }
    @media screen and (max-width: 20rem) {
      .score-card {
        padding: 0.6rem 1rem 1rem;
      }
    }
  `

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'score-cards': ScoreCards,
  }
}

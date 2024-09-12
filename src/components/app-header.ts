import { css, html, LitElement, TemplateResult } from 'lit';

import { customElement, property } from 'lit/decorators.js';
import { TAppRoute } from '../types/general';
import { inputHasValue, linkHasHref } from '../type-guards';
import { sendToStore } from '../redux/redux-utils';
import { setAppState } from '../redux/app-state';

const routes : TAppRoute[] = [
  { anchor: 'game', label: 'Keep score', icon: '' },
  { anchor: 'players', label: 'Manage players', icon: '' },
  { anchor: 'teams', label: 'Manage teams', icon: '' },
  { anchor: 'pastGames', label: 'View past games', icon: '' },
]

@customElement('app-header')
export class AppHeader extends LitElement {
  // ------------------------------------------------------
  // START: props

  @property({ type: Boolean })
  darkmode : boolean = false;

  //  END:  props
  // ------------------------------------------------------
  // START: state

  private navDialog : HTMLDialogElement|null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper methods

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

  //  END:  render helpers
  // ------------------------------------------------------
  // START: main render method


  render() {
    return html`
      <header>
        <div>
          <h1>Scored</h1>
          <p>Keep score in your favourite game!</p>
        </div>
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
                <li>
                  <button type="button" class="mode-btn">
                    ${(this.darkmode === true) ? 'Light' : 'Dark'}
                    mode
                  </button>
                </li>
                <li class="size-adjust">
                  Font size:
                  <button type="button" value="1" class="size-btn plus">+</button>
                  <button type="button" value="-1" class="size-btn minus">-</button>
                </li>
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
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    header div {
      display: flex;
      align-items: center;
      column-gap: 0.75rem;
      padding-right: 1rem;
    }
    h1 {
      font-size: 2rem;
      line-height: 2rem;
      margin: 0;
    }
    p {
      font-size: 0.75rem;
      line-height: 0.95rem;
      margin: 0;
      max-width: 9rem;
      transform: translateY(0.075rem)
    }
    nav {
      position: absolute;
      top: 0;
      right: 0;
    }
    dialog {
      box-sizing: border-box;
      position: relative;
      border: 0.05rem solid #fff;
      padding: 1rem 0;
      border-radius: 0.3rem;
    }
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }
    .menu-toggle {
      background-color: transparent;
      border-color: #fff;
      border-bottom-left-radius: 0.3rem;
      border-right: none;
      border-top: none;
      display: block;
      height: 2rem;
      line-height: 5rem;
      overflow: hidden;
      position: absolute;
      right: 0;
      width: 2rem;
    }
    .menu-toggle:hover {
      cursor: pointer;
    }
    .menu-toggle::before,
    .menu-toggle::after {
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
    .menu-toggle--open {
      top: 0;
    }
    .menu-toggle--open::before {
      border-bottom-width: 0.1rem;
      border-top-width: 0.1rem;
      height: 0.75rem;
    }
    .menu-toggle--open::after {
      border-top-width: 0.1rem;
      border-bottom: none;
      height: 0.1rem;
      margin-top: 0.05rem;
    }
    .menu-toggle--close {
      top: -1rem;
    }
    .menu-toggle--close::before,
    .menu-toggle--close::after {
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
    .menu-toggle--close::before {
      transform: translate(50%, -50%) rotate(-45deg);
    }
    .menu-toggle--close::after {
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
    .nav-menu-list a, .mode-btn, li.size-adjust {
      box-sizing: border-box;
      display: block;
      width: 100%;
      padding: 0.4rem 1rem;
      margin: 0;
    }
    .nav-wrap {
      position: relative;
      z-index: 1;
      margin: 0;
      padding: 0;
    }
    .close-menu-background {
      bottom: 0;
      color: transparent;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
    }
    .mode-btn {
      border: none;
      background: transparent;
      text-align: left;
      font-size: 1rem;
      cursor: pointer;
    }
    .size-btn {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
    }
    .minus { cursor: zoom-out; }
    .plus { cursor: zoom-in; }

    @media screen and (max-width: 20rem) {
      header div p { display: none; }
    }
  `

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': AppHeader,
  }
}

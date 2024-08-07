import { html, TemplateResult } from 'lit';
import { IIndividualPlayer, IIndividualPlayerFilterable } from '../../types/players';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export const renderFilterInput = (
  players : IIndividualPlayerFilterable[],
  handler : Function,
) : TemplateResult|string => {
  if (players.length > 5) {
    return html`
    <p>
      <label for="player-filter">Filter:</label>
      <input
        id="player-filter"
        type="search"
        placeholder="enter players name"
        @keyup=${handler}  />
    </p>`
  }

  return '';
};

export const renderPlayerItem = (
  player: IIndividualPlayerFilterable,
  keyupHandler : Function,
  clickHandler : Function,
  selecting: boolean = false,
  isDupe : boolean,
) : TemplateResult|string => {
  // const label = (selecting === true)
  //   ? 'Add'
  //   : 'Edit';
  const name = `${player.name} ${player.secondName}`;

  let output : TemplateResult|string = '';

  if (selecting === true) {
    output = html`
      <label for="player-${player.id}">
        <span class="sr-only">Add</span> ${name}
      </label>
      <button
        type="button"
        id="player-${player.id}"
        value="${player.id}"
        @click="${clickHandler}">Add</button>`;
  } else {
    output = html`<details>
      <summary>
        <span class="sr-only">Edit</span> ${name}
      </summary>
      ${renderPlayerForm(
        player.name,
        player.secondName,
        isDupe,
        keyupHandler,
        clickHandler,
        true,
      )}
    </details>`;
  }

  return html`<li class="list-item">${output}</li>`;
};

export const renderPlayersList = (
  players : IIndividualPlayerFilterable[],
  keyupHandler : Function,
  clickHandler : Function,
  selecting: boolean = false,
  isDupe : boolean,
) : TemplateResult => html`
    <ul class="list-wrap">
      ${repeat(
        players,
        (player) => player.id,
        (player) => renderPlayerItem(
          player,
          keyupHandler,
          clickHandler,
          selecting,
          isDupe,
        ))}
    </ul>`;

export const renderNoPlayers = (
  players : IIndividualPlayer[],
  filteredPlayers : IIndividualPlayerFilterable[],
  filterStr : string,
) : TemplateResult|string => {
  if (players.length === 0) {
    return html`
      <p>There are no players registered. Please add some players</p>`;
  }

  if (filteredPlayers.length === 0 && filterStr.trim() !== '') {
    return html`<p>No players were matched using "${filterStr}"</p>`;
  }
  return '';
};

export const renderDuplicatePlayerMsg = (
  givenName : string,
  familyName : string,
  isDupe : boolean,
) : TemplateResult|string => {
  if (isDupe === true) {
    return html`
      <p id="new-player-duplicate-msg">
        Player "${givenName} ${familyName}" already exists in the system.
        Please choose a different name
      <p>`;
  }

  return '';
};

export const renderNameField = (
  label: string,
  value: string,
  placeholder: string,
  isDupe: boolean,
  handler: Function,
) : TemplateResult => {
  const key = label.toLocaleLowerCase();
  const descByID = (isDupe === true)
  ? 'new-player-duplicate-msg'
  : undefined;
  const fieldID = `players-list-new-player-${key}-name`;

  return html`
    <li class="field-item">
      <label for="${fieldID}">${label} name</label>
      <input
        .aria-describedby=${ifDefined(descByID)}
        id="${fieldID}"
        type="text"
        .value="${value}"
        pattern="^[a-z0-9]+( +[a-z0-9]+)*$"
        placeholder="${placeholder}"
        @keyup=${handler} />
    </li>`;
};

export const renderPlayerForm = (
  givenName : string,
  familyName : string,
  isDupe : boolean,
  keyupHandler: Function,
  clickHandler: Function,
  editing: boolean = false,
) => {
  const pre = 'new-player-btn'
  const btnCls = (isDupe === true)
    ? `${pre} ${pre}-error`
    : pre;
  const labelBy = 'players-list-new-player-head';

  let label = 'Add';
  let heading = 'New player';

  if (editing === true) {
    label = 'Update';
    heading = `Update ${givenName} ${familyName}`;
  }

  return html`
    <div role="group" arial-labeldby="${labelBy}">
      <h2 id=="${labelBy}">${heading}</h2>
      <ul class="field-wrap">
        ${renderNameField(
          'Given',
          givenName,
          'Gabbie',
          isDupe,
          keyupHandler,
        )}
        ${renderNameField(
          'Family',
          familyName,
          'Augustus',
          isDupe,
          keyupHandler,
        )}
      </ul>

      ${renderDuplicatePlayerMsg(
        givenName,
        familyName,
        isDupe,
      )}

      <button
        .class="${btnCls}"
        type="button"
        value="${label.toLocaleLowerCase()}"
        @click=${clickHandler}>${label} player</button>
    </div>`;
}

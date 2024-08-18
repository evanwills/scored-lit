import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { IIndividualPlayer, IIndividualPlayerFilterable } from '../../types/players';
import './player-data-form';

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

/**
 * Get a player item for a list of players
 *
 * @param player       Data for player being rendered
 * @param keyupHandler Key up event handler
 * @param clickHandler Click event handler
 * @param selecting    Whether or not the list is for selecting
 *                     a player for a game
 * @param isDupe       Whether or not the player's name already
 *                     exists in the list of players
 *
 * @returns HTML for player list item
 */
export const renderPlayerItem = (
  player: IIndividualPlayerFilterable,
  normalisedNames: string[],
) : TemplateResult|string => {
  // const label = (selecting === true)
  //   ? 'Add'
  //   : 'Edit';
  const name = `${player.name} ${player.secondName}`;
  return html`
    <li class="list-item">
      <details>
        <summary>
          <span class="sr-only">Edit</span> ${name}
        </summary>

        <player-data-form
          edit
          given-name="${player.name}"
          family-name="${player.secondName}"
          normalised-names=${normalisedNames}></player-data-form>
      </details>
    </li>`;
};

export const renderPlayersList = (
  players : IIndividualPlayerFilterable[],
  normalisedNames: string[],
) : TemplateResult => html`
    <ul class="list-wrap">
      ${repeat(
        players,
        (player) => player.normalisedName,
        (player) => renderPlayerItem(player, normalisedNames))
      }
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

export const renderNameField = (
  id: string,
  label: string,
  value: string,
  initialVal: string,
  placeholder: string,
  isDupe: boolean,
  handler: Function,
) : TemplateResult => {
  const key = label.toLocaleLowerCase();
  const _id = (typeof id === 'string' && id.trim() !== '')
    ? id
    : 'new-player';
  const descByID = (isDupe === true)
    ? `${_id}-duplicate-msg`
    : undefined;

  const fieldID = `edit-${_id}-${key}-name`;

  return html`
    <li class="field-item">
      <label for="${fieldID}">${label} name</label>
      <input
        .aria-describedby=${ifDefined(descByID)}
        data-initial="${initialVal}"
        id="${fieldID}"
        type="text"
        .value="${value}"
        pattern="^[a-zA-Z0-9]+( +[a-zA-Z0-9]+)*$"
        placeholder="${placeholder}"
        @keyup=${handler} />
    </li>`;
};

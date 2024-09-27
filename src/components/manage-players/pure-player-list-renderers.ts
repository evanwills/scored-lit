import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { IIndividualPlayer, ITeam } from '../../types/players';
import './player-data-form';
import { getPlayerByID } from '../../utils/player-utils';
import { namePatternBasic, namePatternFamily, namePatternGeneral } from '../../utils/general-utils';

export const renderFilterInput = (
  userCount : number,
  type: string,
  handler : Function,
) : TemplateResult|string => {
  if (userCount > 5) {
    return html`
    <p>
      <label for="${type}-filter">Filter:</label>
      <input
        id="${type}-filter"
        type="search"
        placeholder="Enter ${type}'s name"
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
  player: IIndividualPlayer,
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
  players : IIndividualPlayer[],
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
  userCount : number,
  filterCount : number,
  filterStr : string,
  filterType : string,
) : TemplateResult|string => {
  if (userCount === 0) {
    return html`
      <p>There are no ${filterType}s registered. Please add some ${filterType}s</p>`;
  }

  if (filterCount === 0 && filterStr.trim() !== '') {
    return html`<p>No ${filterType}s were matched using "${filterStr}"</p>`;
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
  nameType: string = 'basic',
) : TemplateResult => {
  const key = label.toLocaleLowerCase();
  const _id = (typeof id === 'string' && id.trim() !== '')
    ? id
    : 'new-player';
  const descByID = (isDupe === true)
    ? `${_id}-duplicate-msg`
    : undefined;

  const fieldID = `edit-${_id}-${key}-name`;

  let pattern = namePatternBasic;

  if (nameType === 'family') {
    pattern = namePatternFamily;
  } else if (nameType === 'general') {
    pattern = namePatternGeneral;
  }

  return html`
    <li class="field-item">
      <label for="${fieldID}">${label} name</label>
      <input
        .aria-describedby=${ifDefined(descByID)}
        data-initial="${initialVal}"
        id="${fieldID}"
        type="text"
        .value="${value}"
        pattern="${pattern}"
        placeholder="${placeholder}"
        @keyup=${handler} />
    </li>`;
};

/**
 * Get list item with checkbox and label for an individual player
 *
 * @param player
 * @returns list item with checkbox and label for an individual player
 *
 * @todo disable checkbox when too many teams have been selected
 */
export const playerCheckboxItem = (IDs : string[]) => (player : IIndividualPlayer) : TemplateResult => {
  // console.group('playerCheckboxItem()');
  // console.log('IDs:', IDs);
  // console.log('player.id:', player.id);
  // console.groupEnd();
  return html`
    <li>
      <input id="player-${player.id}" type="checkbox" value="${player.id}" ?checked=${IDs.indexOf(player.id) > -1} />
      <label for="player-${player.id}">
        ${player.name} ${player.secondName}
      </label>
    </li>`;
}


export const renderTeamMembers = (members : string[], players : IIndividualPlayer[]) : TemplateResult[] => {
  return members.map((playerID) => {
    const player = getPlayerByID(players, playerID);

    return html`<li>
      ${(player !== null)
        ? `${player.name} ${player.secondName}`
        : 'Unkown player'}
      </li>`;
  });
}

/**
 *
 * @param allplayers
 * @returns
 * @todo disable checkbox when too many teams have been selected
 */
export const teamCheckboxItem = (allplayers: IIndividualPlayer[]) => (team : ITeam) : TemplateResult => html`
  <li>
    <input id="team-${team.id}" type="checkbox" value="${team.id}" />
    <label for="team-${team.id}">
      ${team.name}
    </label>
    <ul>
      ${renderTeamMembers(team.members, allplayers)}
    </ul>
  </li>`;

import { IPlayer, ITeam} from '../types/players.d'



/**
 * Get a player matched by the player's ID
 *
 * @param playerList List of players/teams
 * @param id         ID of player/team to be returned
 *
 * @returns player/team object if one was matched by ID.
 *          `null` if no player could be matched.
 */
export const getPlayerByID = <T extends IPlayer>(playerList : T[], id : string) : T|null => {
  console.group('getPlayerByID()');
  console.log('playerList:', playerList);
  console.log('id:', id);
  for (let a = 0; a < playerList.length; a += 1) {
    console.log(`playerList[${a}]:`, playerList[a]);
    console.log('id:', id);
    console.log(`playerList[${a}].id:`, playerList[a].id);
    console.log(`playerList[${a}].name:`, playerList[a].name);
    console.log(`playerList[${a}].id === id:`, `("${playerList[a].id}" === "${id}")`, playerList[a].id === id);
    if (playerList[a].id === id) {
      return playerList[a];
    }
  }
  return null;
}

/**
 * Get a list of player matching IDs in a list
 *
 * @param playerList List of players/teams
 * @param IDs        List of player/team IDs to be included in the
 *                   output.
 *
 * @returns A list of players matched by their IDs
 */
export const filterPlayersByIDs = <T extends IPlayer>(playerList : T[], IDs : string[]) : T[] => playerList.filter(
  (player : T) => (typeof IDs.find((id) => id === (player as IPlayer).id) !== 'undefined')
);

/**
 * Get a list of player matching IDs that are not in a list
 *
 * @param playerList List of players/teams
 * @param IDs        List of player/team IDs to be included in the
 *                   output.
 *
 * @returns A list of players matched by their IDs
 */
export const excludePlayersByIDs = <T extends IPlayer>(playerList : T[], IDs : string[]) : T[]|null => playerList.filter(
  (player) => (typeof IDs.find((id) => id === player.id) === 'undefined'),
);

/**
 * Sort list of players alphabetically
 *
 * @param players List of players to be sorted
 *
 * @returns List of players sorted alphabetically
 */
export const sortPlayersByName = <T extends IPlayer>(players: T[]) : T[] => {
  const output : T[] = [...players];

  output.sort((a : T, b: T) : number => {
    if (a.normalisedName < b.normalisedName) {
      return -1;
    }
    if (a.normalisedName > b.normalisedName) {
      return 1;
    }

    return 0;
  });

  return output;
};

/**
 * Get a function that returns TRUE if players/teams matched by
 * normalised name
 *
 * @param filter Normalised name string
 *
 * @returns Function the can be passed to Array.filter()
 */
export const getFilterPlayersByName = (filter : string) => <T extends IPlayer>(player : T) : boolean => player.normalisedName.includes(filter);

/**
 * Check whether a (normalised) player/team name matches another
 * (normalised) player/team name
 *
 * @param nName     Normalised name of player/team
 * @param nNameList List of normalised player/team names
 *
 * @returns TRUE if normalised name already exists.
 *          FALSE if normalised name is unique
 */
export const nameIsDuplicate = (
  nName: string,
  nNameList: string[],
) : boolean => nNameList.includes(nName);

/**
 * Check whether a Player/Team has the same (normalised) name as
 * another Player/Team
 *
 * > __Note:__ This is a more reliable check than `nameIsDuplicate()`
 * >           because it makes sure the user being checked is not
 * >           being checked against itself
 *
 * @param user     Player/Team object containing `normalisedName`
 *                 property
 * @param allUsers List of all
 *
 * @returns TRUE if player's/Team's normalised name is unique within
 *          the list of all players/teams.
 *          FALSE if it matches another player/team's normalised name.
 */
export const usernameIsUnique = (user: IPlayer, allUsers: IPlayer[]) => {
  for (let a = 0; a < allUsers.length; a += 1) {
    if (user.normalisedName === allUsers[a].normalisedName && user.id !== allUsers[a].id) {
      // name has been matched and users being compared are different
      return false;
    }
  }

  return true;
}

/**
 * Check whether a team identical members to another team
 *
 * @param team     Team to be checked
 * @param allTeams List of all teams
 *
 * @returns Empty string if team being compared does not have
 *          identical members to any other team
 */
export const hasSameMembers = (
  team : ITeam,
  allTeams : ITeam[]
) : string => {
  const { members } = team;
  const l = members.length;

  if (l === 0) {
    // this is a new team with no members so cannot be compared
    // against other teams yet
    return '';
  }

  // compare members
  allT : for (let a = 0; a < allTeams.length; a += 1) {
    if (l !== allTeams[a].members.length || team.id === allTeams[a].id) {
      // Teams have a different number of members so cannot be a
      // duplicate
      // Or
      // Team being checked is the same as the one it is being
      // compared to in the list.
      continue;
    }

    for (let b = 0; b < l; b += 1) {
      if (allTeams[a].members.includes(members[b]) === false) {
        // team member[b] is not in allTeams[a]!
        // teams must be different;
        // Lets move on to the next team
        continue allT;
      }
    }

    // We're still in this loop which means that all the members are
    // the same in both teams
    return `Team: "${team.name}" has the same members as ${allTeams[a].name}`;
  }

  // Definitely not a duplicate;
  return '';
}

/**
 * Get a list of teams with the right number of members
 *
 * @param teams List of teams
 * @param min   Minimum number of players required for team to be eligible
 * @param max   Maximum number of players required for team to be eligible
 *
 * @returns List of teams with the right number of players
 */
export const getTeamByMemberCount = (teams: ITeam[], min: number, max: number) => {
  if (min > 0 || max > 0) {
    return teams.filter((team : ITeam) : boolean => {
      const l = team.members.length;

      return ((min === 0 || l >= min) && (max === 0 || l <= max))
    });
  }
  return [...teams];
}

/**
 * Get a list of normalised player/team names from the list of
 * player/team objects
 *
 * @param players List of players/teams
 *
 * @returns List of normalised names for all players/teams in the
 *          source list.
 */
export const getNormalisedNames = (players: IPlayer[]) : string[] => players.map((player: IPlayer) : string => player.normalisedName);

/**
 * Get a list of teams a player belongs to.
 *
 * @param playerID ID of player whose teams should be listed
 * @param teams    List of all teams
 *
 * @returns List of teams the player is a member of.
 */
export const getPlayersTeams = (
  playerID: string,
  teams: ITeam[]
) : ITeam[] => teams.filter((team) => team.members.includes(playerID));

/**
 * Check whether two lists of members are identical
 *
 * @param oldMembers Previous list of members (Player IDs) of a team
 * @param newMembers New list of members (Player IDs) of a team
 *
 * @returns TRUE if `oldMembers` has exactly the same members as
 *          `newMembers`. FALSE otherwise
 */
export const membersAreSame = (
  oldMembers: string[],
  newMembers: string[]
) : boolean => {
  const oldL = oldMembers.length;
  const newL = newMembers.length;

  if (oldL !== newL) {
    return false
  }

  for (let a = 0; a < oldL; a += 1) {
    if (newMembers.includes(oldMembers[a]) === false) {
      return false;
    }
  }

  return true;
}

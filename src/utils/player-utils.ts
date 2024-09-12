import { IPlayer} from '../types/players.d'

export const getPlayerByID = <T>(playerList : T[], id : string) : T|null => {
  for (let a = 0; a < playerList.length; a += 1) {
    if ((playerList[a] as IPlayer).id === id) {
      return playerList[a];
    }
  }
  return null;
}

export const filterPlayersByIDs = <T>(playerList : T[], IDs : string[]) : T[] => playerList.filter(
  (player : T) => (typeof IDs.find((id) => id === (player as IPlayer).id) !== 'undefined')
);

export const excludePlayersByIDs = <T>(playerList : T[], IDs : string[]) : T[]|null => playerList.filter(
  (player) => (typeof IDs.find((id) => id === (player as IPlayer).id) === 'undefined')
);

export const getFilterPlayersByName = (filter : string) => <T>(player : T) : boolean => (player as IPlayer).normalisedName.includes(filter);

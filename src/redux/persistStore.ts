import { Store } from "redux"
import { getLocalValue, setLocalValue } from "../utils/storage-utils";

export const persistStore = (store : Store) => async () => {
  const current = store.getState();
  const slices = [
    {
      name: 'currentGame',
      types: [
        'CURRENT_GAME_ADD_NEW',
        'CURRENT_GAME_ADD_PLAYER',
        'CURRENT_GAME_END',
        'CURRENT_GAME_FORCE_END',
        'CURRENT_GAME_NATURAL_END',
        'CURRENT_GAME_RESTART_SAME',
        'CURRENT_GAME_START_SAME_NEW_PLAYERS',
        'CURRENT_GAME_RESUME',
        'CURRENT_GAME_SELECT_RESUME',
        'CURRENT_GAME_SET_MODE',
        'CURRENT_GAME_SET_LEAD',
        'CURRENT_GAME_SET_NEW_GAME',
        'CURRENT_GAME_SET_SCORE',
        'CURRENT_GAME_SET_TYPE',
        'CURRENT_GAME_UPDATE_LEAD',
        'CURRENT_GAME_UPDATE_SCORE',
      ],
    },
    {
      name: 'players',
      types: [
        'PLAYER_CREATE',
        'PLAYER_DELETE',
        'PLAYER_UPDATE',
      ],
    },
    {
      name: 'teams',
      types: [
        'TEAM_CREATE',
        'TEAM_ADD_PLAYER',
        'TEAM_UPDATE',
        'TEAM_DELETE',
      ],
    },
    {
      name: 'pastGames',
      types: [
        'PAST_GAME_CREATE',
        'PAST_GAME_DELETE',
        'PAST_GAME_UPDATE',
        'PAST_GAME_RESUME',
      ],
    },
    {
      name: 'gameRules',
      types: [
        'GAME_RULES_CREATE',
        'GAME_RULES_DELETE',
        'GAME_RULES_UPDATE',
      ],
    },
    {
      name: 'customGames',
      types: [
        'CUSTOM_GAME_CREATE',
        'CUSTOM_GAME_DELETE',
        'CUSTOM_GAME_UPDATE',
      ],
    },
  ];
  let slice = slices.find((action) => action.types.includes(current.lastAction));

  if (typeof slice !== 'undefined') {
    const key = slice.name;

    setLocalValue(key, JSON.stringify(current[key]));
  }

}

export const retrieveStore = (
  slice: string,
  type: string,
  oldValue: any,
) => getLocalValue(slice, oldValue, type);

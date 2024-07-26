import { createSlice } from '@reduxjs/toolkit';
import { getLocalValue } from '../../utils/storage-utils';
import { IGameRuleData } from '../../types/game-rules';
import { gameFinder, gameUpdater } from '../game-utils';



export const initialState : Array<IGameRuleData> = getLocalValue('customGame', [], 'object|null');

export const customGamesSlice = createSlice({
  name: 'customGames',
  initialState,
  reducers: {
    CUSTOM_GAME_CREATE: (state, _action) => {
      const nameOrID = state.find(gameFinder(_action.payload.name, _action.payload.id));

      if (typeof nameOrID !== 'undefined') {
        throw new Error(
          `Could not create new custom game "${_action.payload.name}" `
          + 'because another game is already using that name',
        );
      }

      return [...state, _action.payload];
    },
    CUSTOM_GAME_DELETE: (state, _action) => state.filter(
      gameFinder(_action.payload.name, _action.payload.id),
    ),
    CUSTOM_GAME_UPDATE: (state, _action) => state.map(gameUpdater(_action.payload)),
  },
});

export const { CUSTOM_GAME_CREATE, CUSTOM_GAME_DELETE, CUSTOM_GAME_UPDATE } = customGamesSlice.actions;

export default customGamesSlice.reducer;

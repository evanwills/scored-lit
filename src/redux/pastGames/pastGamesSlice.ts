import { createSlice } from '@reduxjs/toolkit';
import { TGameData } from '../../types/game-data.d';
import { addNewPastGame, deletePastGame, updatePastGame } from './past-reducers';
import { getLocalValue } from '../../utils/storage-utils';

export const initialState : Array<TGameData> = getLocalValue('pastGames', [], 'object|null');

export const pastGamesSlice = createSlice({
  name: 'pastGames',
  initialState,
  reducers: {
    PAST_GAME_ADD_NEW: addNewPastGame,
    PAST_GAME_DELETE: deletePastGame,
    PAST_GAME_UPDATE: updatePastGame,
  },
});

export const { PAST_GAME_ADD_NEW, PAST_GAME_DELETE, PAST_GAME_UPDATE } = pastGamesSlice.actions;

export default pastGamesSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { getLocalValue } from '../../utils/general.utils';
import { TCustomGame } from '../../types/game-data';



export const initialState : Array<TCustomGame> = getLocalValue('customGame', []);

export const customGamesSlice = createSlice({
  name: 'customGames',
  initialState,
  reducers: {
    CUSTOM_GAME_CREATE: (state, _action) => state,
    CUSTOM_GAME_DELETE: (state, _action) => state,
    CUSTOM_GAME_UPDATE: (state, _action) => state,
  },
});

export const { CUSTOM_GAME_CREATE, CUSTOM_GAME_DELETE, CUSTOM_GAME_UPDATE } = customGamesSlice.actions;

export default customGamesSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { IIndividualPlayer } from '../../types/players';
import { addNewPlayer, deletePlayer, updatePlayer } from './players-reducers';

export const initialState : Array<IIndividualPlayer> = [];

export const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    PLAYERS_ADD_NEW: addNewPlayer,
    PLAYERS_DELETE: deletePlayer,
    PLAYERS_UPDATE: updatePlayer,
  },
});

export const { PLAYERS_ADD_NEW, PLAYERS_DELETE, PLAYERS_UPDATE } = playersSlice.actions;

export default playersSlice.reducer;

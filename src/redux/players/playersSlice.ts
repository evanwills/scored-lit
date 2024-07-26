import { createSlice } from '@reduxjs/toolkit';
import { IIndividualPlayer } from '../../types/players';
import { addNewPlayer, deletePlayer, updatePlayer } from './players-reducers';
import { getLocalValue } from '../../utils/storage-utils';

export const initialState : Array<IIndividualPlayer> = getLocalValue('pastGame', [], 'object|null');

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

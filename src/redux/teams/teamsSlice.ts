import { createSlice } from '@reduxjs/toolkit';
import { ITeam } from '../../types/players';
import { addNewTeam, deleteTeam, updateTeam } from './team-reducers';
import { getLocalValue } from '../../utils/general.utils';

export const initialState : Array<ITeam> = getLocalValue('pastGameSlice', []);;

export const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    TEAMS_ADD_NEW: addNewTeam,
    TEAMS_DELETE: deleteTeam,
    TEAMS_UPDATE: updateTeam,
  },
});

export const { TEAMS_ADD_NEW, TEAMS_DELETE, TEAMS_UPDATE } = playersSlice.actions;

export default playersSlice.reducer;

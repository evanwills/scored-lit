import { createAction } from "@reduxjs/toolkit";
import { ITeam } from "../../types/players";

export const TeamActions = {
  ADD_PLAYER: 'TEAM_ADD_PLAYER',
  CREATE: 'TEAM_CREATE',
  DELETE: 'TEAM_DELETE',
  UPDATE: 'TEAM_UPDATE',
}

export const addPlayerToTeamAction = createAction<{ teamID: string, playerID: string}, 'TEAM_ADD_PLAYER'>('TEAM_ADD_PLAYER');
export const addNewTeamAction = createAction<ITeam, 'TEAM_CREATE'>('TEAM_CREATE');
export const updateTeamAction = createAction<ITeam, 'TEAM_UPDATE'>('TEAM_UPDATE');
export const deleteTeamAction = createAction<string, 'TEAM_DELETE'>('TEAM_DELETE');

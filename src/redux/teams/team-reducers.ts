import { AnyAction, Reducer } from 'redux';
import { ITeam } from '../../types/players';
import { createReducer } from '@reduxjs/toolkit';
// import { initialState } from './teamsSlice';
import { addNewTeamAction, addPlayerToTeamAction, deleteTeamAction, updateTeamAction } from './team-actions';
import { getLocalValue } from '../../utils/storage-utils';

export const addNewTeamReducer : Reducer = (
  state : Array<ITeam>,
  action: AnyAction,
) => {
  const { id, name } = action.payload;
  const matched = state.filter((team) => (team.id === id ||
    team.name === name));

  if (matched.length > 0) {
    throw new Error(
      'addNewTeam() - `TEAM_CREATE` failed because team: ' +
      `${name} already exists.`
    );
  }

  return [...state, action.payload];
};

export const deleteTeamReducer : Reducer = (
  state : Array<ITeam>,
  action: AnyAction,
) => state.filter((team) => team.id !== action.payload);

export const updateTeamReducer : Reducer = (
  state : Array<ITeam>,
  action: AnyAction,
) => state.map(
  (team) => { // eslint-disable-line arrow-body-style
    return (team.id === action.payload.id)
      ? {
        ...team,
        name: action.payload.name,
        members: action.payload.members,
      }
      : team;
  },
);

export const addPlayerToTeamReducer : Reducer = (
  state : Array<ITeam>,
  action: AnyAction,
) => {
  return state.map((team) => (team.id === action.payload.teamID)
    ? {
        ...team,
        members: [...team.members, action.payload.playerID],
      }
    : team
  );
}

export const initialState : Array<ITeam> = getLocalValue('pastGameSlice', [], 'object|null');

export default createReducer(
  initialState,
  (builder) => {
    builder.addCase(addPlayerToTeamAction, addPlayerToTeamReducer);
    builder.addCase(addNewTeamAction, addNewTeamReducer);
    builder.addCase(deleteTeamAction, deleteTeamReducer);
    builder.addCase(updateTeamAction, updateTeamReducer);
  }
)

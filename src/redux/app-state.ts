import { AnyAction, createAction, createReducer, Reducer } from '@reduxjs/toolkit';

export enum EAppStates {
  game = 'CURRENT_GAME',
  players = 'MANAGE_PLAYERS',
  teams = 'MANAGE_TEAMS',
  pastGames = 'LIST_PAST_GAMES',
}

export const setAppState = createAction<EAppStates, 'SET_APP_STATE'>('SET_APP_STATE');

export const setAppStateReducer : Reducer = (state: EAppStates, action: AnyAction) : EAppStates => {
  if (typeof action.payload !== 'undefined') {
    return action.payload;
  }
  return state;
};

export const appStateReducer = createReducer(
  EAppStates.game,
  (builder) => {
    builder.addCase(setAppState, setAppStateReducer)
  },
);

import { AnyAction, createAction, createReducer, Reducer } from '@reduxjs/toolkit';

export enum EAppStates {
  game = 'CURRENT_GAME',
  players = 'MANAGE_PLAYERS',
  teams = 'MANAGE_TEAMS',
  pastGames = 'LIST_PAST_GAMES',
  interuptedGames = 'LIST_PAST_INTERUPTED_GAMES',
}

export const setAppState = createAction<string, 'SET_APP_STATE'>('SET_APP_STATE');

const getEnumKeyByEnumValue = <T extends {[index:string]:string}>(
  myEnum : T,
  enumKey : string,
  state: EAppStates,
):keyof T => {
  let keys = Object.keys(myEnum).filter(x => x == enumKey);
  return keys.length > 0 ? myEnum[keys[0]] : state;
}

export const setAppStateReducer : Reducer = (state: EAppStates, action: AnyAction) : EAppStates => {
  if (typeof action.payload == 'string' && action.payload in EAppStates) {
    return getEnumKeyByEnumValue(EAppStates, action.payload, state) as EAppStates;
  }
  return state;
};

export const appStateReducer = createReducer(
  EAppStates.game,
  (builder) => {
    builder.addCase(setAppState, setAppStateReducer)
  },
);

import { Dispatch, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { currentGameActions } from './current-actions';
import { EGameStates, TGameData, TScoredStore } from '../../types/game-data.d';
import { pastGameActions } from '../pastGames/past-actions';
import { getIdAndStart, getNewGame } from '../../utils/general-utils';

export const currentGameMiddleware : Middleware = (store) => (next: Dispatch) => (action: PayloadAction) => {
  const state : TScoredStore = store.getState();
  const current : TGameData|null = state.currentGame;
  console.group('currentGameMiddleware');
  console.log('action:', action);

  switch (action.type) {
    case currentGameActions.RESTART:
      console.groupEnd();
      return next({
        type: currentGameActions.SET_NEW,
        payload: {
          ...current,
          ...getIdAndStart(),
          scores: current?.scores.map((player) => ({
            ...player,
            scores: [],
            total: 0,
            position: 0,
          })),
          state: EGameStates.ADD_PLAYERS,
        },
      });

    case currentGameActions.RESTART_CHANGE_PLAYERS:
      console.groupEnd();

      return next({
        type: currentGameActions.SET_NEW,
        payload: {
          ...current,
          ...getIdAndStart(),
          scores: [],
          players: [],
          mode: (typeof current !== 'undefined' && current !== null && current.scores.length <= 0)
            ? EGameStates.ADD_PLAYERS
            : EGameStates.PLAYING,
        },
      });

    case currentGameActions.ADD_NEW_GAME:
      console.groupEnd();
      if (typeof action.payload === 'string') {
        console.log('state:', state);
        return next({
          type: currentGameActions.SET_NEW,
          payload: getNewGame(
            state.gameTypes,
            action.payload,
            EGameStates.ADD_PLAYERS),
        });
      }
      break;

    case currentGameActions.FORCE_END:
    case currentGameActions.NATURAL_END:
      console.groupEnd();
      const endedGame = {
        ...current,
        state: EGameStates.GAME_OVER,
        forced: (action.type === currentGameActions.FORCE_END),
      };
      store.dispatch({
        ...action,
        type: pastGameActions.CREATE,
        payload: endedGame
      });
      return next({
        ...action,
        type: currentGameActions.END_GAME,
        payload: endedGame,
      });

    default:
      console.log('middleware not applied');
      console.groupEnd();
      return next(action);
  }
};

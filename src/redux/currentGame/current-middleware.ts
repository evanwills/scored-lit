import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';
import { currentGameActions } from './current-actions';
import { EGameStates, TGameData, TScoredStore } from '../../types/game-data.d';
import { pastGameActions } from '../pastGames/past-actions';

export const currentGameMiddleware : Middleware = (store) => (next: Dispatch) => (action: AnyAction) => {
  const state : TScoredStore = store.getState();
  const current : TGameData|null = state.currentGame;

  switch (action.type) {
    case currentGameActions.RESTART:
      return next({
        type: currentGameActions.SET_NEW,
        payload: {
          ...current,
          state: EGameStates.PLAYING,
          forced: false,
          scores: current?.scores.map((player) => ({
            ...player,
            scores: [],
            total: 0,
            position: 0,
          })),
          start: Date.now(),
          winner: '',
        },
      });

    case currentGameActions.RESTART_CHANGE_PLAYERS:
      return next({
        type: currentGameActions.SET_NEW,
        payload: {
          ...current,
          forced: false,
          scores: [],
          start: Date.now(),
          state: EGameStates.ADD_PLAYERS,
          winner: '',
        },
      });

    case currentGameActions.ADD_NEW_GAME:
      return next({
        type: currentGameActions.SET_NEW,
        payload: {
          forced: false,
          scores: [],
          start: Date.now(),
          state: EGameStates.SET_TYPE,
          teams: false,
          type: '',
          winner: '',
        },
      });

    case currentGameActions.FORCE_END:
    case currentGameActions.NATURAL_END:
      const endedGame = {
        ...current,
        state: EGameStates.GAME_OVER,
        forced: (action.type === currentGameActions.FORCE_END),
      };
      store.dispatch({
        ...action,
        type: pastGameActions.ADD_NEW,
        payload: endedGame
      });
      return next({
        ...action,
        type: currentGameActions.END_GAME,
        payload: endedGame,
      });

    default:
      return next(action);
  }
};

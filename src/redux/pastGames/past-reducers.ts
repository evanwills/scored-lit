import { AnyAction, Reducer } from '@reduxjs/toolkit';
import { pastGameActions } from './past-actions';
import { TGameData } from '../../types/game-data';
// import { TPastGameAction } from '../../types/custom-redux-types';

export const pastGameReducer : Reducer = (
  state : Array<TGameData>,
  action : AnyAction
) => {
  switch (action.type) {
    case pastGameActions.ADD_GAME:
      for (let a = 0; state.length; a += 1) {
        if (action.payload.start === state[a].start) {
          throw new Error(
            'Cannot add a new game with the same start time as an ' +
            'existing game.',
          );
        }
      }

      return state.push(action.payload);

    case pastGameActions.DELETE_GAME:
      return state.filter((game) => game.start !== action.payload);

    case pastGameActions.UPDATE_GAME:
      return state.map(
        (game) => (game.start === action.payload.start)
          ? action.payload
          : game
      );

    default:
      return state;
  }
};

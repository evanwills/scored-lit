import { AnyAction, Reducer } from '@reduxjs/toolkit';
// import { pastGameActions } from './past-actions';
import { TGameData } from '../../types/game-data.d';
// import { TPastGameAction } from '../../types/custom-redux-types';

export const addNewPastGame : Reducer = (
  state : Array<TGameData>,
  action: AnyAction,
) : Array<TGameData> => {
  for (let a = 0; state.length; a += 1) {
    if (action.payload.id === state[a].id) {
      throw new Error(
        'Cannot add a new game with the same ID as an ' +
        'existing game.',
      );
    }
  }

  return [...state, action.payload];
};

export const deletePastGame : Reducer = (
  state : Array<TGameData>,
  action: AnyAction,
) : Array<TGameData> => state.filter((game) => game.id !== action.payload);

export const updatePastGame : Reducer = (
  state : Array<TGameData>,
  action: AnyAction
) : Array<TGameData> => state.map(
  (game) => (game.start === action.payload.id)
    ? action.payload
    : game
);


// export const pastGameReducer : Reducer = (
//   state : Array<TGameData>,
//   action : AnyAction
// ) => {
//   switch (action.type) {
//     case pastGameActions.ADD_NEW:
//       for (let a = 0; state.length; a += 1) {
//         if (action.payload.id === state[a].id) {
//           throw new Error(
//             'Cannot add a new game with the same ID as an ' +
//             'existing game.',
//           );
//         }
//       }

//       return state.push(action.payload);

//     case pastGameActions.DELETE:
//       return state.filter((game) => game.id !== action.payload);

//     case pastGameActions.UPDATE:
//       return state.map(
//         (game) => (game.start === action.payload.id)
//           ? action.payload
//           : game
//       );

//     default:
//       return state;
//   }
// };

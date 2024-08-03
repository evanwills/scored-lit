import { AnyAction, Reducer } from "redux";
import { IIndividualPlayer } from '../../types/players';
import { createReducer } from "@reduxjs/toolkit";
import { getLocalValue } from "../../utils/storage-utils";
import { addNewPlayerAction, deletePlayerAction, updatePlayerAction } from "./players-actions";

export const addNewPlayerReducer : Reducer = (
  state : Array<IIndividualPlayer>,
  action: AnyAction,
) => {
  const { id, name, secondName } = action.payload;
  const matched = state.filter((player) => (player.id === id ||
    (player.name === name && player.secondName === secondName)));

  if (matched.length > 0) {
    throw new Error(
      'addNewPlayer() - `PLAYERS_ADD_NEW` failed because player: ' +
      `${name} ${secondName} already exists.`
    );
  }

  return [...state, action.payload];
};

export const deletePlayerReducer : Reducer = (
  state : Array<IIndividualPlayer>,
  action: AnyAction,
) => state.filter((player) => player.id !== action.payload);

export const updatePlayerReducer : Reducer = (
  state : Array<IIndividualPlayer>,
  action: AnyAction,
) => state.map(
  (player) => { // eslint-disable-line arrow-body-style
    return (player.id === action.payload.id)
      ? {
        ...player,
        name: action.payload.name,
        secondName: action.payload.secondName,
      }
      : player;
  },
);

export const initialState : IIndividualPlayer[] = getLocalValue('players', [], 'object|null');

export default createReducer(
  initialState,
  (builder) => {
    builder.addCase(addNewPlayerAction, addNewPlayerReducer);
    builder.addCase(deletePlayerAction, deletePlayerReducer);
    builder.addCase(updatePlayerAction, updatePlayerReducer);
  }
)

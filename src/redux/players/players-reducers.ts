import { AnyAction, Reducer } from "redux";
import { IIndividualPlayer } from '../../types/players';

export const addNewPlayer : Reducer = (
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

export const deletePlayer : Reducer = (
  state : Array<IIndividualPlayer>,
  action: AnyAction,
) => state.filter((player) => player.id !== action.payload);

export const updatePlayer : Reducer = (
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

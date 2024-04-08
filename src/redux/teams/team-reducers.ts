import { AnyAction, Reducer } from 'redux';
import { IIndividualPlayer } from '../../types/players';

export const addNewTeam : Reducer = (
  state : Array<IIndividualPlayer>,
  action: AnyAction,
) => {
  const { id, name, secondName } = action.payload;
  const matched = state.filter((team) => (team.id === id ||
    team.name === name));

  if (matched.length > 0) {
    throw new Error(
      'addNewPlayer() - `PLAYERS_ADD_NEW` failed because team: ' +
      `${name} ${secondName} already exists.`
    );
  }

  return [...state, action.payload];
};

export const deleteTeam : Reducer = (
  state : Array<IIndividualPlayer>,
  action: AnyAction,
) => state.filter((team) => team.id !== action.payload);

export const updateTeam : Reducer = (
  state : Array<IIndividualPlayer>,
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

import { AnyAction, Reducer,  } from 'redux';
import { EGameStates, TGameData } from '../../types/game-data.d';
import {
  // getLocalValue,
  sumScores,
} from '../../utils/general.utils';
// import {
//   addNewGame,
//   addGamePlayer,
//   forceEndGame,
//   naturalEndGame,
//   restartGame,
//   restartNewPlayers,
//   resumeGame,
//   setGameMode,
//   setHandLead,
//   setPlayerScore,
//   setType,
//   updateHandLead,
//   updatePlayerScore,
// } from './current-actions';
// import {
//   // Builder,
//   createReducer,
// } from '@reduxjs/toolkit';

const notSet = 'There is no game set yet.';

const notPlaying = (func: string, action: string, state : TGameData|null) : false => {
  if (state !== null && state.mode === EGameStates.PLAYING) {
    return false;
  }

  const _state = (state === null)
    ? notSet
    : `It appears that this game is in ${state.mode} mode.`;

  throw new Error(
    `${func}() - \`${action}\` action expects current game ` +
    `to be in \`PLAYING\` mode. ${_state}`
  );
};

const notEnded = (func: string, action: string, state : TGameData|null) : false => {
  if (state !== null && state.mode !== EGameStates.PLAYING) {
    return false;
  }
  let _state = 'There is no game set yet.'
  if (state !== null) {
    _state = 'It appears that this game is still in progress.';
  }


  throw new Error(
    `${func}() - \`${action}\` action expects current game to ` +
    'be in `GAME_OVER`, `SET_TYPE` or `ADD_PLAYERS` mode. ' +
    _state,
  );
};

const wrongMode = (func: string, action: string, mode: EGameStates, state : TGameData|null) : false => {
  if (state !== null && state.mode !== EGameStates.PLAYING) {
    return false;
  }

  const _state = (state === null)
    ? notSet
    : `It appears that this game is in \`${state.mode}\` mode.`;

  throw new Error(
    `${func}() - \`${action}\` action expects current game to ` +
    `be in \`${mode}\` mode. ${_state}`,
  );
};

export const setNewGame : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notEnded('setNewGame', 'CURRENT_GAME_SET_NEW_GAME', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    end: null,
    forced: false,
    id: action.payload.id,
    lead: null,
    players: [],
    scores: [],
    start: action.payload.start,
    mode: EGameStates.SET_TYPE,
    teams: false,
    type: '',
    winner: null,
  };
};

export const setNewSameGame : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notEnded('setNewSameGame', 'CURRENT_GAME_START_NEW_SAME', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    end: null,
    forced: false,
    id: action.payload.id,
    lead: null,
    mode: EGameStates.PLAYING,
    scores: [],
    start: action.payload.start,
    winner: null,
  };
};

export const setSameGameNewPlayers : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notEnded('setSameGameNewPlayers', 'CURRENT_GAME_START_SAME_NEW_PLAYERS', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    end: null,
    forced: false,
    id: action.payload.id,
    lead: null,
    players: [],
    scores: [],
    start: action.payload.start,
    mode: EGameStates.ADD_PLAYERS,
    winner: null,
  };
};

export const setGameType : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    wrongMode('setGameType', 'CURRENT_GAME_SET_TYPE', EGameStates.SET_TYPE, state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    type: action.payload.type,
    teams: action.payload.teams,
  };
};

export const setPlayer : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    wrongMode('setPlayer', 'CURRENT_GAME_ADD_PLAYER', EGameStates.ADD_PLAYERS, state);
  } catch(error: any) {
    throw Error(error);
  }

  let ok = true;

  for (let a = 0; a < state.players.length; a += 1) {
    if (state.players[a].id === action.payload.id) {
      ok = false;
      break;
    }
  }

  return (ok === false)
    ? state
    : {
      ...state,
      players: [...state.players, action.payload],
    };
};

export const endGameNatural : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('endGameNatural', 'CURRENT_GAME_NATURAL_END', state);
  } catch(error: any) {
    throw Error(error);
  }
  if (state === null || state.mode !== EGameStates.PLAYING) {
    throw new Error(
    );
  }

  return {
    ...state,
    end: action.payload,
    mode: EGameStates.GAME_OVER,
  };
};

export const endGameForced : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('endGameForced', 'CURRENT_GAME_FORCE_END', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    end: action.payload,
    forced: true,
    mode: EGameStates.GAME_OVER,
  };
};

export const setLead : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('setLead', 'CURRENT_GAME_SET_LEAD', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    lead: action.payload,
  };
};

export const setMode : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('setMode', 'CURRENT_GAME_SET_MODE', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    mode: action.payload,
  };
};

export const setMode : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('setMode', 'CURRENT_GAME_SET_MODE', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    mode: action.payload,
  };
};

export const resumeInterruptedGame : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('resumeInterruptedGame', 'CURRENT_GAME_RESUME', state);
  } catch(error: any) {
    throw Error(error);
  }

  return action.payload;
};

export const updateLead : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('updateLead', 'CURRENT_GAME_UPDATE_LEAD', state);
  } catch(error: any) {
    throw Error(error);
  }

  if (state.lead === null || state.lead.player.id !== action.payload.id) {
    throw new Error(
      'updateLead() - `CURRENT_GAME_UPDATE_LEAD` action ' +
      'expects previous game to be ended. It appears that the ' +
      'previous game is still in progress.'
    );
  }

  return {
    ...state,
    lead: {
      player: state.lead.player,
      call: action.payload.call,
      suit: action.payload.suit,
    },
  };
};

export const setScore : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('setScore', 'CURRENT_GAME_SET_SCORE', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    scores: state.scores.map((player) => {
      if (player.id === action.payload.id) {
        if (player.scores.length < action.payload.round) {
          throw new Error(
            'setScore() - `CURRENT_GAME_SET_SCORE` action ' +
            'expects score round to be next one to be scored.'
          );
        }
        const output = {
          ...player,
          scores: [...player.scores, action.payload.score],
        };

        output.total = sumScores(output.scores);

        return output;
      }

      return player;
    }),
  };
};

export const updateScore : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  try {
    notPlaying('updateScore', 'CURRENT_GAME_UPDATE_SCORE', state);
  } catch(error: any) {
    throw Error(error);
  }

  return {
    ...state,
    scores: state.scores.map((player) => {
      if (player.id === action.payload.id) {
        return {
          ...player,
          scores: player.scores.map(
            (score, i) => (i === action.payload.round)
              ? action.payload.score
              : score,
          ),
        };
      }

      return player;
    }),
  };
};

// const initialState : TGameData|null = getLocalValue('currentGame', null);

// export default createReducer(
//   initialState,
//   (builder : Builder) => {
//     builder.addCase(addNewGame, setNewGame);
//     builder.addCase(addGamePlayer, setPlayer);
//     builder.addCase(forceEndGame, endGameForced);
//     builder.addCase(naturalEndGame, endGameNatural);
//     builder.addCase(restartGame, setNewSameGame);
//     builder.addCase(restartNewPlayers, setSameGameNewPlayers);
//     builder.addCase(resumeGame, resumeInterruptedGame);
//     builder.addCase(setGameMode, setMode);
//     builder.addCase(setHandLead, setLead);
//     builder.addCase(setPlayerScore, setScore);
//     builder.addCase(setType, setGameType);
//     builder.addCase(updateHandLead, updateLead);
//     builder.addCase(updatePlayerScore, updateScore);
//   },
// );



import { AnyAction, Reducer,  } from 'redux';
import { EGameStates, TGameData } from '../../types/game-data.d';
import {
  sumScores,
} from '../../utils/general-utils';
import { getLocalValue } from '../../utils/storage-utils';
import {
  addNewGameAction,
  addGamePlayerAction,
  forceEndGameAction,
  naturalEndGameAction,
  restartGameAction,
  restartNewPlayersAction,
  resumeSelectedGameAction,
  setGameModeAction,
  setHandLeadAction,
  setPlayerScoreAction,
  setGameTypeAction,
  updateHandLeadAction,
  updatePlayerScoreAction,
  selectGameToResumeAction,
  setNewGameAction,
} from './current-actions';
import {
  // builder,
  createReducer,
  PayloadAction,
} from '@reduxjs/toolkit';
import { isGameData, isPayloadAction } from '../../type-guards';

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
  if (state === null ||state.mode !== EGameStates.PLAYING) {
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

export const setNewGameReducer : Reducer = (
  state : TGameData,
  action: AnyAction
) : TGameData => {
  console.group('redus.currentGame.setNewGame()');
  console.log('state:', state);
  console.log('action:', action);
  try {
    notEnded('setNewGame', 'CURRENT_GAME_SET_NEW_GAME', state);
  } catch(error: any) {
    throw Error(error);
  }

  if (isPayloadAction(action)) {
    const { payload } = (action as PayloadAction);

    if (isGameData(payload)) {
      console.groupEnd();
      return { ...(payload as TGameData) };
    }
  }
  console.groupEnd();

  return state;
};

export const setNewSameGameReducer : Reducer = (
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

export const setGameTypeReducer : Reducer = (
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

export const setPlayerReducer : Reducer = (
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

export const endGameNaturalReducer : Reducer = (
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

export const endGameForcedReducer : Reducer = (
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

export const setLeadReducer : Reducer = (
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

export const setModeReducer : Reducer = (
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

export const resumeInterruptedGameReducer : Reducer = (
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

export const updateLeadReducer : Reducer = (
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

export const setScoreReducer : Reducer = (
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

export const updateScoreReducer : Reducer = (
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

export const currentGameDefaultReducer : Reducer = (
  state : TGameData,
  // action: AnyAction
) : TGameData => {
  // console.group('currentGameDefaultReducer()');
  // console.log('state:', state);
  // console.log('action:', action);
  // console.log('action.type:', action.type);
  // console.log('action.payload:', action.payload);
  // console.groupEnd();
  return state;
}


const initialState : TGameData|null = getLocalValue('currentGame', null, 'object|null');

export default createReducer(
  initialState,
  (builder) => {
    builder.addCase(addNewGameAction, setNewGameReducer);
    builder.addCase(setNewGameAction, setNewGameReducer);
    builder.addCase(addGamePlayerAction, setPlayerReducer);
    builder.addCase(forceEndGameAction, endGameForcedReducer);
    builder.addCase(naturalEndGameAction, endGameNaturalReducer);
    builder.addCase(restartGameAction, setNewSameGameReducer);
    builder.addCase(restartNewPlayersAction, setSameGameNewPlayers);
    builder.addCase(resumeSelectedGameAction, resumeInterruptedGameReducer);
    builder.addCase(selectGameToResumeAction, (state, _action) => state);
    builder.addCase(setGameModeAction, setModeReducer);
    builder.addCase(setHandLeadAction, setLeadReducer);
    builder.addCase(setPlayerScoreAction, setScoreReducer);
    builder.addCase(setGameTypeAction, setGameTypeReducer);
    builder.addCase(updateHandLeadAction, updateLeadReducer);
    builder.addCase(updatePlayerScoreAction, updateScoreReducer);
    builder.addDefaultCase(currentGameDefaultReducer);
  },
);



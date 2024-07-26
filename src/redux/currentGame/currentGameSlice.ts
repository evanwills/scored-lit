import { createSlice } from '@reduxjs/toolkit';
import { TGameData } from '../../types/game-data.d';
import {
  endGameForced,
  endGameNatural,
  setGameType, setLead, setNewGame, setNewSameGame, setPlayer, setSameGameNewPlayers, setScore, updateLead, updateScore } from './current-reducers';
import { getLocalValue } from '../../utils/storage-utils';

const initialState : TGameData|null = getLocalValue('currentGame', null, 'object|null');

export const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState,
  reducers: {
    // CURRENT_GAME_ADD_NEW: ,
    // CURRENT_GAME_ADD_INNER: ,
    CURRENT_GAME_ADD_PLAYER: setPlayer,
    // CURRENT_GAME_END: ,
    CURRENT_GAME_FORCE_END: endGameForced,
    CURRENT_GAME_NATURAL_END: endGameNatural,
    CURRENT_GAME_REMOVE_PLAYER: setPlayer,
    // CURRENT_GAME_RESUME: ,
    // CURRENT_GAME_RESTART_SAME: ,
    CURRENT_GAME_SET_NEW_GAME: setNewGame,
    CURRENT_GAME_SET_LEAD: setLead,
    CURRENT_GAME_SET_SCORE: setScore,
    CURRENT_GAME_SET_TYPE: setGameType,
    CURRENT_GAME_START_NEW_SAME: setNewSameGame,
    CURRENT_GAME_START_SAME_NEW_PLAYERS: setSameGameNewPlayers,
    CURRENT_GAME_UPDATE_LEAD: updateLead,
    CURRENT_GAME_UPDATE_SCORE: updateScore,
  }
});

export const {
  CURRENT_GAME_ADD_PLAYER,
  CURRENT_GAME_FORCE_END,
  CURRENT_GAME_NATURAL_END,
  CURRENT_GAME_REMOVE_PLAYER,
  CURRENT_GAME_SET_NEW_GAME,
  CURRENT_GAME_SET_LEAD,
  CURRENT_GAME_SET_SCORE,
  CURRENT_GAME_SET_TYPE,
  CURRENT_GAME_START_NEW_SAME,
  CURRENT_GAME_START_SAME_NEW_PLAYERS,
  CURRENT_GAME_UPDATE_LEAD,
  CURRENT_GAME_UPDATE_SCORE,
} = currentGameSlice.actions;

export default currentGameSlice.reducer;

import { createAction } from '@reduxjs/toolkit';
import { IPlayer } from '../../types/players';
import {
  EGameStates,
  // EGameStates,
  TActionPayloadGameLead,
  // TActionPayloadGameMode,
  TActionPayloadGameSetScore,
  TActionPayloadGameUpdateScore,
  // TActionPayloadNewGame,
  TGameData,
} from '../../types/game-data';

export const currentGameActions = {
  /**
   * Create a totally new game with nothing set
   *
   * > __Note:__ This action ignores any payload that might be
   * >           supplied with the action
   *
   * @property ADD_NEW_GAME
   */
  ADD_NEW_GAME: 'CURRENT_GAME_ADD_NEW',
  /**
   * Add a known player (or team for teams based games) to the list
   * of players playing the current game
   *
   * @property ADD_PLAYER
   */
  ADD_PLAYER: 'CURRENT_GAME_ADD_PLAYER',
  /**
   * Store the ended game in the store
   *
   * > __Note:__ This should only ever be done via middle ware.
   *
   * @property END_GAME
   */
  END_GAME: 'CURRENT_GAME_END',
  /**
   * The game has not reached it's natural end but has to be
   * terminated for one reason or another
   *
   * @property FORCE_END
   */
  FORCE_END: 'CURRENT_GAME_FORCE_END',
  /**
   * The game has reached it's natural end.
   * Copy the game data to the `pastGames` collection in the store
   *
   * @property NATURAL_END
   */
  NATURAL_END: 'CURRENT_GAME_NATURAL_END',
  /**
   * Restart the current game keeping the same game type and players
   *
   * @property RESTART
   */
  RESTART: 'CURRENT_GAME_RESTART_SAME',
  /**
   * Restart the current game keeping the same game type but
   * changing the players
   *
   * @property RESTART_CHANGE_PLAYERS
   */
  RESTART_CHANGE_PLAYERS: 'CURRENT_GAME_START_SAME_NEW_PLAYERS',
  /**
   * Take the data from a past game and make it the current game
   *
   * > __Note:__ This should only ever be done via middle ware.
   *
   * @property RESUME_GAME
   */
  RESUME_GAME: 'CURRENT_GAME_RESUME',
  /**
   * For games like 500, each "trick" has a lead which changes how
   * scores are allocated.
   *
   * Setting the lead allows scored to calculate the score based on
   * the number of tricks won by each team
   *
   * @property SET_LEAD
   */
  SET_LEAD: 'CURRENT_GAME_SET_LEAD',
  /**
   * Set the current game mode
   *
   * @property SET_MODE
   */
  SET_MODE: 'CURRENT_GAME_SET_MODE',
  /**
   * Replace current game data with new game data
   *
   * > __Note:__ This should only ever be done via middle ware.
   *
   * @property SET_NEW
   */
  SET_NEW: 'CURRENT_GAME_SET_NEW_GAME',
  /**
   * Set the score for a particular player
   *
   * @property SET_SCORE
   */
  SET_SCORE: 'CURRENT_GAME_SET_SCORE',
  /**
   * Set the type of game being played
   *
   * @property SET_TYPE
   */
  SET_TYPE: 'CURRENT_GAME_SET_TYPE',
  /**
   * Update the lead for the current trick
   *
   * @property UPDATE_LEAD
   */
  UPDATE_LEAD: 'CURRENT_GAME_UPDATE_LEAD',
  /**
   * Update an incorrect score for a particular player
   *
   * @property UPDATE_SCORE
   */
  UPDATE_SCORE: 'CURRENT_GAME_UPDATE_SCORE',
}

// const newGameBasic = (id: string, start: string) => ({ payload: { id, start }});
// const endGameBasic = (end: string) => ({ payload: end});

/**
 * Create a totally new game with nothing set
 *
 * > __Note:__ This action ignores any payload that might be
 * >           supplied with the action.
 *
 * @property ADD_NEW_GAME
 */
export const addNewGameAction = createAction<string, 'CURRENT_GAME_ADD_NEW'>('CURRENT_GAME_ADD_NEW');

export const addGamePlayerAction = createAction<IPlayer, 'CURRENT_GAME_ADD_PLAYER'>( 'CURRENT_GAME_ADD_PLAYER');

export const endGameAction = createAction<string, 'CURRENT_GAME_END'>('CURRENT_GAME_END');

export const forceEndGameAction = createAction<string, 'CURRENT_GAME_FORCE_END'>('CURRENT_GAME_FORCE_END');

export const naturalEndGameAction = createAction<string, 'CURRENT_GAME_NATURAL_END'>('CURRENT_GAME_NATURAL_END');

export const restartGameAction = createAction<null, 'CURRENT_GAME_RESTART_SAME'>('CURRENT_GAME_RESTART_SAME');

export const restartNewPlayersAction = createAction<null, 'CURRENT_GAME_START_SAME_NEW_PLAYERS'>('CURRENT_GAME_START_SAME_NEW_PLAYERS');

export const resumeSelectedGameAction = createAction<TGameData, 'CURRENT_GAME_RESUME'>('CURRENT_GAME_RESUME');

export const selectGameToResumeAction = createAction<null, 'CURRENT_GAME_SELECT_RESUME'>('CURRENT_GAME_SELECT_RESUME');

export const setGameModeAction = createAction<EGameStates, 'CURRENT_GAME_SET_MODE'>('CURRENT_GAME_SET_MODE');

export const setHandLeadAction = createAction<TActionPayloadGameLead, 'CURRENT_GAME_SET_LEAD'>('CURRENT_GAME_SET_LEAD');

export const setNewGameAction = createAction<TGameData, 'CURRENT_GAME_SET_NEW_GAME'>('CURRENT_GAME_SET_NEW_GAME');

export const setPlayerScoreAction = createAction<TActionPayloadGameSetScore, 'CURRENT_GAME_SET_SCORE'>('CURRENT_GAME_SET_SCORE');

/**
 * Set the type of game being played
 *
 * @property SET_TYPE
 */
export const setGameTypeAction = createAction<string, 'CURRENT_GAME_SET_TYPE'>('CURRENT_GAME_SET_TYPE');

export const updateHandLeadAction = createAction<TActionPayloadGameLead, 'CURRENT_GAME_UPDATE_LEAD'>('CURRENT_GAME_UPDATE_LEAD');

export const updatePlayerScoreAction = createAction<TActionPayloadGameUpdateScore, 'CURRENT_GAME_UPDATE_SCORE'>('CURRENT_GAME_UPDATE_SCORE');

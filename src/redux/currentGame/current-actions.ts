// import { createAction } from '@reduxjs/toolkit';
// import { IPlayer } from '../../types/players';
// import { EGameStates, TGameData } from '../../types/game-data';

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
// const endGameBasic = (end: string) => ({ payload: end})

// export const addGamePlayer = createAction(
//   currentGameActions.ADD_PLAYER,
//   (player: IPlayer) => ({
//     payload: player
//   }),
// );

// export const addNewGame = createAction(
//   currentGameActions.ADD_NEW_GAME,
//   newGameBasic,
// );

// export const endGame = createAction(currentGameActions.END_GAME);
// export const forceEndGame = createAction(
//   currentGameActions.FORCE_END,
//   endGameBasic,
// );
// export const naturalEndGame = createAction(
//   currentGameActions.NATURAL_END,
//   endGameBasic,
// );
// export const restartGame = createAction(
//   currentGameActions.RESTART,
//   newGameBasic,
// );
// export const restartNewPlayers = createAction(
//   currentGameActions.RESTART_CHANGE_PLAYERS,
//   newGameBasic,
// );
// export const resumeGame = createAction(
//   currentGameActions.RESUME_GAME,
//   (game: TGameData) => ({ payload: game }),
// );

// export const setGameMode = createAction(
//   currentGameActions.SET_MODE,
//   (mode: EGameStates, start: string) => ({ payload: { mode, start }}),
// );

// export const setHandLead = createAction(
//   currentGameActions.SET_LEAD,
//   (id: string, call: number, suit: string) => ({ payload: { id, call, suit} }),
// );

// export const setPlayerScore = createAction(
//   currentGameActions.SET_SCORE,
//   (id: string, score: number) => ({ payload: { id, score} }),
// );

// export const setType = createAction(
//   currentGameActions.SET_TYPE,
//   (type: string) => ({ payload: type }),
// );

// export const updateHandLead = createAction(
//   currentGameActions.UPDATE_LEAD,
//   (call: number, suit: string) => ({ payload: { call, suit} }),
// );

// export const updatePlayerScore = createAction(
//   currentGameActions.UPDATE_SCORE,
//   (id: string, round: number, score: number) => ({ payload: { id, round, score} }),
// );

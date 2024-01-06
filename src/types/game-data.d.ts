import { TPlayer, TTeam } from "./players";
import { TGameScoreCard, TScoreCard } from "./score-card";

export type TCustomGame = {
  lowestWins: boolean,
  name: string,
  maxPlayers: number|null = 0,
  maxScore: number|null = null,
  minPlayers: number,
  minScore: number|null,
  onlyWinOnCall: boolean,
  possibleCalls: Array<TCall>,
  requiresCall: boolean,
  requiresTeam: boolean,
}

export enum EGameStates {
  SET_TYPE,
  ADD_PLAYERS,
  PLAYING,
  GAME_OVER,
}

/**
 * @type Data for a single game
 */
export type TGameData = {
  /**
   * Whether or not the game was force finished.
   *
   * If `forced` is TRUE, the game can be resumed at a later date.
   *
   * @property
   */
  forced: boolean,

  /**
   * @property List of players (or teams) who are/were playing this
   *           game
   */
  players: Array<string>,

  /**
   * @property Score cards for each player
   */
  scores: TGameScoreCard,

  /**
   * @property Timestamp for when the game started
   */
  start: number,

  /**
   * State of the current game
   *
   * Possible states are:
   * * SET_TYPE - Set the type of game being played
   * * ADD_PLAYERS - Add players to game
   * * PLAYING - Add scores
   * * GAME_OVER
   *
   * __Note:__ If a TGameData object is in the past games list it
   *           will only ever be in `GAME_OVER` state.
   *
   * @property
   */
  state: EGameStates,

  /**
   * @property Whether or not the players are actually teams
   */
  teams: boolean,

  /**
   * @property The type of game this score is for
   */
  type: string,

  /**
   * @property ID of the winning player or team
   */
  winner: string,
};

/**
 * @property data for the whole app
 */
export type TScoredStore = {
  /**
   * @property The game currently in progress and taking scores
   */
  currentGame: TGameData|null,

  /**
   * @property List of configuration settings for custom games
   */
  customGames: Array<TCustomGame>,

  /**
   * @property List of all the past games scored by this app
   */
  pastGames: Array<TGameData>,

  /**
   * @property List of all players who have ever played a game
   *           scored by this app
   */
  players: Array<TPlayer>,

  /**
   * @property List of all teans who have ever played a game
   *           scored by this app
   */
  teams: Array<TTeam>,
}

export type TWinnerLooser = {
  high: {
    id: string,
    score: number,
  },
  low: {
    id: string,
    score: number,
  },
};

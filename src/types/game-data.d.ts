import { TPlayer, TTeam } from "./players";
import { TGameScoreCard, TScoreCard } from "./score-card";

export type TCustomGame = {
  /**
   * For trick based games (like 500) a game can only be won if the
   * winning team won the call at the start of th hand
   *
   * @property
   */
  callToWin: boolean,

  /**
   * Some games are played so that the person with the lowest
   * score wins or the person with the lowest score looses (which
   * is almost the same).
   *
   * e.g. In Crazy Eights the first person to 100 looses.
   *
   * @property
   */
  lowestWins: boolean,

  /**
   * Name of the game being scored
   *
   * @property
   */
  name: string,

  /**
   * Maximum number of players who can play the game
   *
   * zero means there is no maximum
   *
   * @property
   */
  maxPlayers: number,

  /**
   * Maximum score over which a winner (or looser) can be declared
   *
   * @property
   */
  maxScore: number|null = null,

  /**
   * Minimum number of players who can play the game.
   * (This would normally be two)
   *
   * @property
   */
  minPlayers: number,

  /**
   * Minimum score over which a looser (or winner) can be declared
   *
   * @property
   */
  minScore: number|null,

  /**
   * For trick based games (like 500) there are a fixed set of calls
   * that are made at the start of each hand. This specifies all the
   * allowed calles and their scores.
   *
   * @property
   */
  possibleCalls: Array<TCall>,

  /**
   * For trick based games (like 500), at the start of each hand,
   * each player can make a call on how many tricks they think they
   * can win that hand. The winner of the call gets the kitty
   * scoring and game play is affected by the call.
   *
   * @property
   */
  requiresCall: boolean,

  /**
   * Some games like 500 & Bridge are played in teams.
   *
   * @property
   */
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

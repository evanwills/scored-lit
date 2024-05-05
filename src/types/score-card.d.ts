export interface IScoreEntry {
  time: string,
  call: string|null,
  score: number,
  success: boolean|null,
}

export interface IScoreEntryStandard {
  call: null,
  score: number,
  success: null,
  time: string,
}

export interface IScoreEntryTrick {
  call: string|null,
  score: number,
  success: boolean|null,
  time: string,
}

export type TScoreCard = {
  /**
   * @property ID of player or team who own the scores
   */
  id: string,

  /**
   * @property Current rank of the player/team
   */
  position: number,

  /**
   * @property List of scores from each round of the game
   */
  scores: Array<IScoreEntry>,

  /**
   * @property Sum of all the scores for this player/team
   */
  total: number,
};

export type TSimpleScore = {
  [index: string] : number,
};

export type TGameScoreCard = Array<TScoreCard>;

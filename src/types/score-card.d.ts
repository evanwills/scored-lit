export type TScoreCard = {
  /**
   * @property ID of player or team who own the scores
   */
  id: string,

  /**
   * @property List of scores from each round of the game
   */
  scores: Array<number>,

  /**
   * @property Sum of all the scores for this player/team
   */
  total: number,

  /**
   * Current rank of the player/team
   */
  position: number,
};

export type TSimpleScore = {
  [index: string] : number,
};

export type TGameScoreCard = Array<TScoreCard>;

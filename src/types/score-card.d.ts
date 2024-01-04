export type TScoreCard = {
  id: string,
  scores: Array<number>,
  total: number,
  position: number,
};

export type TSimpleScore = {
  [index: string] : number,
};

export type TGameScoreCard = [TScoreCard];

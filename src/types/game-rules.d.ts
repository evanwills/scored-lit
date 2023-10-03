import { TGameScoreCard, TScoreCard } from "./score-card"

export type TCall = {
  id: string,
  name: string,
  score: number,
  tricks: number,
}

export interface TLead extends TCall {
  id: string,
  name: string,
  score: number,
  tricks: number,
  playerID: string
}

export type FHasWon = () => string;
export type FUpdateScore = (playerID: string, score: number, round: number) => number;

export type FGetScore = (score: number, playerID: string) => number;

export interface IGameRules {
  canPlay: () => boolean,
  gameOver: () => boolean,
  getCalls: () => Array<TCall>,
  getCall: (id: string) => TCall|null,
  getLooser: () => string,
  getScore: FGetScore,
  getWinner: () => string,
  setLead: (playerID: string, call: string) => void,
  setScore: (playerID: string, score: number) => number,
  updateScore: FUpdateScore,
  readonly name: string,
  readonly maxPlayers: number|null,
  readonly maxScore: number|null,
  readonly minPlayers: number,
  readonly minScore: number|null,
  readonly onlyWinOnCall: boolean,
  readonly requiresCall: boolean,
  readonly rules: string,
  readonly possibleCalls: Array<TCall>
}

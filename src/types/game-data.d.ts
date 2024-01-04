import { TPlayer, TTeam } from "./players";
import { TGameScoreCard, TScoreCard } from "./score-card"

export type TGameData = {
  start: number,
  players: Array<string>,
  type: string,
  scores: TGameScoreCard,
  winner: string,
};

export type TScoredStore = {
  currentGame: TGameData,
  players: Array<TPlayer>,
  teams: Array<TTeam>,
  pastGames: Array<TGameData>
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

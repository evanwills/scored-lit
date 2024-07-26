import { IGameRuleData } from '../types/game-rules.d';

export const gameFinder = (name : string, id : string) => (game : IGameRuleData) => (game.name === name || game.id === id);

export const gameUpdater = (newGame : IGameRuleData) => (oldGame : IGameRuleData) => {
  if (oldGame.id === newGame.id) {
    return newGame;
  }

  return oldGame;
};

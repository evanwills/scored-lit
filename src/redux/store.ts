import { configureStore } from "@reduxjs/toolkit";
import { TScoredStore } from '../types/game-data';

const defaultStore : TScoredStore = {
  currentGame: null,
  players: [],
  teams: [],
  pastGames: [],
  customGames: [],
};

export default configureStore(
  defaultStore as any,

);

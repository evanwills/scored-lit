import { configureStore } from "@reduxjs/toolkit";
// import { TScoredStore } from '../types/game-data';
import currentGameReducer from "./currentGame/currentGameSlice";
import pastGamesReducer from "./pastGames/pastGamesSlice";

// const defaultStore : TScoredStore = {
//   currentGame: null,
//   customGames: [],
//   pastGames: [],
//   players: [],
//   teams: [],
// };

export default configureStore({
  reducer: {
    currentGame: currentGameReducer,
    pastGames: pastGamesReducer,
  }
});

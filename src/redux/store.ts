import { configureStore } from '@reduxjs/toolkit';
// import { TScoredStore } from '../types/game-data.d';
import currentGameReducer from './currentGame/currentGameSlice';
import pastGamesReducer from './pastGames/pastGamesSlice';
import { currentGameMiddleware } from './currentGame/current-middleware';
import { pastGameMiddleware } from './pastGames/past-middleware';

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
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    currentGameMiddleware,
    pastGameMiddleware,
  ),
});

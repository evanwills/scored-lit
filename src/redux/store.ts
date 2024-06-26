import { configureStore } from '@reduxjs/toolkit';
// import { TScoredStore } from '../types/game-data.d';
import currentGameReducer from './currentGame/currentGameSlice';
import customGamesReducer from './customGames/customGamesSlice';
import gameRulesReducer from './gameRules/gameRulesSlice';
import pastGamesReducer from './pastGames/pastGamesSlice';
import teamsReducer from './teams/teamsSlice';
import playersReducer from './players/playersSlice';
import { currentGameMiddleware } from './currentGame/current-middleware';
import { pastGameMiddleware } from './pastGames/past-middleware';
// import { TScoredStore } from '../types/game-data';

// const defaultStore : TScoredStore = {
//   currentGame: null,
//   customGames: [],
//   pastGames: [],
//   players: [],
//   teams: [],
// };

export const store = configureStore({
  reducer: {
    currentGame: currentGameReducer,
    customGames: customGamesReducer,
    gameTypes: gameRulesReducer,
    pastGames: pastGamesReducer,
    players: playersReducer,
    teams: teamsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    currentGameMiddleware,
    pastGameMiddleware,
  ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

import {
  AnyAction,
  configureStore,
  Reducer,
  // PayloadAction,
} from '@reduxjs/toolkit';
// import { TScoredStore } from '../types/game-data.d';
import { isCustomEvent } from '../type-guards'
import currentGameReducer from './currentGame/current-reducers';
import customGamesReducer from './customGames/customGamesSlice';
import gameRulesReducer from './gameRules/gameRulesSlice';
import pastGamesReducer from './pastGames/pastGamesSlice';
import teamsReducer from './teams/team-reducers';
import playersReducer from './players/players-reducers';
import { currentGameMiddleware } from './currentGame/current-middleware';
import { pastGameMiddleware } from './pastGames/past-middleware';
import { logger } from './redux-utils';
import { appStateReducer } from './app-state';
import { persistStore } from './persistStore';
// import { persistStore, persistReducer } from 'redux-persist'
// import { TScoredStore } from '../types/game-data';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// const defaultStore : TScoredStore = {
//   currentGame: null,
//   customGames: [],
//   pastGames: [],
//   players: [],
//   teams: [],
// };

const lastAction : Reducer = (_state : string, action : AnyAction) : string => action.type;

/**
 * Redux Persist
 *
 * https://www.npmjs.com/package/redux-persist
 */
// const persistConfig = {
//   key: 'root',
//   storage,
// };
// https://www.npmjs.com/package/redux-persist
// const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: {
    currentGame: currentGameReducer,
    customGames: customGamesReducer,
    gameTypes: gameRulesReducer,
    pastGames: pastGamesReducer,
    players: playersReducer,
    teams: teamsReducer,
    appState: appStateReducer,
    lastAction,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    currentGameMiddleware,
    pastGameMiddleware,
    logger,
  ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

store.subscribe(persistStore(store));

document.addEventListener( // @ts-ignore
  'reduxaction', (event: Event) => {
    console.group('store.reduxaction()');
    console.log('event:', event);

    if (isCustomEvent(event)) {
      store.dispatch(event.detail);
    }
    console.groupEnd();
  },
);
// document.addEventListener('dispatch', store.dispatch);

import { AnyAction, Dispatch, Middleware } from "@reduxjs/toolkit";
import { pastGameActions } from "./past-actions";
import { TGameData, TScoredStore } from "../../types/game-data";
import { currentGameActions } from "../currentGame/current-actions";

export const pastGameMiddleware : Middleware = (store) => (next: Dispatch) => (action: AnyAction) => {
  switch (action.type) {
    case pastGameActions.RESUME:
      const state : TScoredStore = store.getState();

      // Find the past game to resume
      const oldGame = state.pastGames.find(
        (game : TGameData) : boolean => (game.start === action.payload as number && game.forced === true)
      );

      if (typeof oldGame !== 'undefined') {
        // Make the past game the current game
        store.dispatch({
          type: currentGameActions.RESUME_GAME,
          payload: oldGame,
        });
        // Delete the past game from the list of the past games.
        return next({
          type: pastGameActions.DELETE,
          payload: oldGame.start,
        });
      } else {
        console.error('pastGameMiddleware could not find the correct game to resume.');
        return next(action);
      }
      break;

    default:
      return next(action);
  }
};

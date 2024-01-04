import { configureStore } from "@reduxjs/toolkit";

const defaultStore = {
  currentGame: null,
  players: [],
  teams: [],
  past: [],
};

export default configureStore(
  defaultStore as any,

)

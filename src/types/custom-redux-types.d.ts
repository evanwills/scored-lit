import { AnyAction } from "@reduxjs/toolkit";
import { TGameData } from "./game-data";

export interface TPastGameAction extends AnyAction {
  payload: TGameData
};

import { AnyAction } from '@reduxjs/toolkit';
import { TGameData } from './game-data';

export interface IPastGameAction extends AnyAction {
  payload: TGameData
};

export type TGameType = {
  id: string,
  name: string,
  description: string,
}

export type TGameTypes = Array<TGameType>;

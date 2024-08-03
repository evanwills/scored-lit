import { createAction } from "@reduxjs/toolkit";
import { IIndividualPlayer } from "../../types/players";
// import { nanoid } from "nanoid";

export const playerActions = {
  CREATE: 'PLAYER_CREATE',
  DELETE: 'PLAYER_DELETE',
  UPDATE: 'PLAYER_UPDATE',
};

export const addNewPlayerAction = createAction<IIndividualPlayer, 'PLAYER_CREATE'>('PLAYER_CREATE');
export const updatePlayerAction = createAction<IIndividualPlayer, 'PLAYER_UPDATE'>('PLAYER_UPDATE');
export const deletePlayerAction = createAction<string, 'PLAYER_DELETE'>('PLAYER_DELETE');

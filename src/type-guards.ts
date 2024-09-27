import { PayloadAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { TGameData } from "./types/game-data";
import { IIndividualPlayer, TPlayerSelectedDetail } from "./types/players";

export const isCustomEvent = (target: Event): target is CustomEvent => {
  return (target as CustomEvent).detail !== undefined;
};
export const isPayloadAction = (action: AnyAction): action is PayloadAction => {
  return (action as PayloadAction).payload !== undefined;
};

// export const eventHasTarget = (result : IDBDatabase) : result is IDBDatabase => {

// };

export const inputHasValue = (target: EventTarget): target is HTMLInputElement => {
  return (target as HTMLInputElement).value !== undefined;
};

export const linkHasHref = (target: EventTarget): target is HTMLAnchorElement => {
  return (target as HTMLAnchorElement).href !== undefined;
};

export const isGameData = (data: TGameData) : data is TGameData => {
  return ((data.end === null || (typeof data.end === 'string' && (data.end as string).trim() !== ''))
    && (typeof data.forced === 'boolean')
    && (typeof data.id === 'string')
    && (typeof data.lead !== 'undefined')
    && (data.looser === null || (typeof data.looser === 'string' && data.looser.trim() !== ''))
    && (typeof data.mode !== 'undefined')
    && (Array.isArray(data.players))
    && (Array.isArray(data.scores))
    && (typeof data.start === 'string')
    && (typeof data.teams === 'boolean')
    && (typeof data.type === 'string')
    && (data.winner === null || (typeof data.winner === 'string' && data.winner.trim() !== ''))
  );
};

export const isIndividualPlayer = (data: IIndividualPlayer) : data is IIndividualPlayer => {
  return (typeof data.id === 'string' && data.id.trim() !== ''
    && typeof data.name === 'string' && data.name.trim() !== ''
    && typeof data.normalisedName === 'string' && data.normalisedName.trim() !== ''
    && typeof data.secondName === 'string')
}

export const isSelectedPlayerDetails = (data: TPlayerSelectedDetail) : data is TPlayerSelectedDetail => {
  if (!Array.isArray(data.IDs) || !Array.isArray(data.players)) {
    return false;
  }
  const idL = data.IDs.length;
  const plL = data.players.length;

  if (idL !== plL) {
    return false;
  }
  for (let a = 0; a < data.IDs.length; a += 1) {
    console.log(`data.IDs[${a}]:`, data.IDs[a]);
    console.log(`data.players[${a}]:`, data.players[a]);
    if (typeof data.IDs[a] !== 'string' || !isIndividualPlayer(data.players[a])) {
      return false;
    }
  }

  return true;
}

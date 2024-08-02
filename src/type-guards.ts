import { PayloadAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { TGameData } from "./types/game-data";

export const isCustomEvent = (target: Event): target is CustomEvent => {
  return (target as CustomEvent).detail !== undefined;
};
export const isPayloadAction = (action: AnyAction): action is PayloadAction => {
  return (action as PayloadAction).payload !== undefined;
};


export const inputHasValue = (target: EventTarget): target is HTMLInputElement => {
  return (target as HTMLInputElement).value !== undefined;
};

export const linkHasHref = (target: EventTarget): target is HTMLAnchorElement => {
  return (target as HTMLAnchorElement).href !== undefined;
};

export const isGameData = (data: TGameData) : data is TGameData => {
  return ((data.end === null || (typeof data.end === 'string' && data.end.trim() !== ''))
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

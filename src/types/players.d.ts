import { UID } from "./base-types";

export interface IPlayer {
  id: UID,
  name: string,
  normalisedName: string,
}

export interface IIndividualPlayer extends IPlayer {
  id: UID,
  name: string,
  secondName: string,
};

export interface ITeam extends IPlayer {
  id: UID,
  name: string,
  members: Array<string>,
};

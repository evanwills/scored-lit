export interface IPlayer {
  id: string,
  name: string,
}

export interface IIndividualPlayer extends IPlayer {
  id: string,
  name: string,
  secondName: string,
};

export interface IIndividualPlayerFilterable extends IIndividualPlayer {
  id: string,
  name: string,
  secondName: string,
  normalisedName: string,
}

export interface ITeam extends IPlayer {
  id: string,
  name: string,
  members: Array<string>,
};

export interface ITeamFilterable extends ITeam {
  id: string,
  name: string,
  members: Array<string>,
  normalisedName: string,
}

export type TNewPlayer = {
  name: string,
  secondName: string,
};

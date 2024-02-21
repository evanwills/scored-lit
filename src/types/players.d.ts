export interface IPlayer {
  id: string,
  name: string,
}

export interface IIndividualPlayer extends IPlayer {
  id: string,
  name: string,
  secondName: string,
};

export interface ITeam extends IPlayer {
  id: string,
  name: string,
  members: Array<TPlayer>,
};


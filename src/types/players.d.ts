export type TPlayer = {
  id: string,
  firstName: string,
  lastName: string,
};

export type TTeam = {
  name: string,
  playerIds: Array<string>,
};

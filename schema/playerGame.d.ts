type UID = string;
type GMTtime = number;
type posInt = number;


type playerGame = {
  gameID: UID,
  gameTypeID: UID,
  playerID: UID,
  isTeam: boolean,
  timestamp: GMTtime,
  rank: posInt,
};

// import { EAppStates } from "../redux/app-state";
// import { TScoredStore } from "../types/game-data";

let scoredDB : IDBDatabase | null = null;

type scoredDBStore = {
  E_gamePermissionsModes: IDBObjectStore | null,
  E_gameStates: IDBObjectStore | null,
  E_playerTypes: IDBObjectStore | null,
  E_scoreControlModes: IDBObjectStore | null,
  J_playerGame: IDBObjectStore | null,
  J_playerTeam: IDBObjectStore | null,
  D_gameTypes: IDBObjectStore | null,
  D_gameData: IDBObjectStore | null,
  D_appState: IDBObjectStore | null,
  D_owners: IDBObjectStore | null,
  D_players: IDBObjectStore | null,
  D_playerScores: IDBObjectStore | null,
  D_teams: IDBObjectStore | null,
}

// let currentGame : IDBObjectStore;

const store : scoredDBStore = {
  E_gamePermissionsModes: null, // object
  E_gameStates: null, // object
  E_playerTypes: null, // object
  E_scoreControlModes: null, // object
  D_appState: null, // object
  D_gameData: null, // array
  D_gameTypes: null, // array
  D_owners: null, // array
  D_playerScores: null, // array
  D_players: null, // array
  D_teams: null, // array
  J_playerGame: null, // array
  J_playerTeam: null, // array
};

const setScoredDB = (event : Event) => {
  if (typeof event.target !== 'undefined' && event.target !== null
    && typeof (event.target as IDBOpenDBRequest).result !== 'undefined'
  ) {
    scoredDB = (event.target as IDBOpenDBRequest).result;
  }
};

export const getScoredDB = () => {
  if (scoredDB === null) {
    const request = window.indexedDB.open('ScoredDB');

    request.onerror = (event : Event) => {
      console.error('Why didn\'t you allow my web app to use IndexedDB?!');
      console.log('error:', event);
    };

    request.onsuccess = setScoredDB;

    request.onupgradeneeded = (event : Event) => {
      if (scoredDB !== null) {
        // ----------------------------------------------------------
        // CREATE STORE: app state store

        store.D_gameTypes = scoredDB.createObjectStore('D_appState');

        // ----------------------------------------------------------
        // CREATE STORE: game data

        store.D_gameData = scoredDB.createObjectStore('D_gamesData', { keyPath: 'id' });
        store.D_gameData.createIndex('createdAt', 'createdAt', { unique: false });
        store.D_gameData.createIndex('createdBy', 'createdBy', { unique: false });
        store.D_gameData.createIndex('endedAt', 'endedAt', { unique: false });
        store.D_gameData.createIndex('forced', 'forced', { unique: false });
        store.D_gameData.createIndex('gameTypeID', 'gameTypeID', { unique: false });
        store.D_gameData.createIndex('gameStateID', 'gameStateID', { unique: false });
        store.D_gameData.createIndex('locked', 'locked', { unique: false });
        store.D_gameData.createIndex('playTime', 'playTime', { unique: false });
        store.D_gameData.createIndex('startedAt', 'startedAt', { unique: false });
        store.D_gameData.createIndex('teams', 'teams', { unique: false });
        store.D_gameData.createIndex('winner', 'winner', { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: game types

        store.D_gameTypes = scoredDB.createObjectStore('D_gameTypes', { keyPath: 'id' });
        store.D_gameTypes.createIndex('name', 'name', { unique: true });
        store.D_gameTypes.createIndex('blocked', 'blocked', { unique: false });
        store.D_gameTypes.createIndex('builtIn', 'builtIn', { unique: false });
        store.D_gameTypes.createIndex('createdAt', 'createdAt', { unique: false });
        store.D_gameTypes.createIndex('createdBy', 'createdBy', { unique: false });
        store.D_gameTypes.createIndex('maxPlayers', 'maxPlayers', { unique: false });
        store.D_gameTypes.createIndex('minPlayers', 'minPlayers', { unique: false });
        store.D_gameTypes.createIndex('requiresTeams', 'requiresTeams', { unique: false });
        store.D_gameTypes.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.D_gameTypes.createIndex('updatedBy', 'updatedBy', { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: owners

        store.D_owners = scoredDB.createObjectStore('D_owners', { keyPath: 'id' });

        // ----------------------------------------------------------
        // CREATE STORE: player scores

        store.D_playerScores = scoredDB.createObjectStore('D_playerScores', { keyPath: 'id' });
        store.D_playerScores.createIndex('gameID', 'gameID', { unique: false });
        store.D_playerScores.createIndex('gameRound', ['gameID', 'round'], { unique: false });
        store.D_playerScores.createIndex('playerGameType', ['playerID', 'gameTypeID'], { unique: false });
        store.D_playerScores.createIndex('playerGameTypeRank', ['playerID', 'gameTypeID', 'scoreIsFinal', 'overallRank'], { unique: false });
        store.D_playerScores.createIndex('playerID', 'playerID', { unique: false });
        store.D_playerScores.createIndex('playerScores', ['gameID', 'playerID', 'round', 'teamID'], { unique: true });
        store.D_playerScores.createIndex('scoreIsFinal', ['gameID', 'scoreIsFinal'], { unique: false });
        store.D_playerScores.createIndex('teamGameType', ['teamID', 'gameTypeID'], { unique: false });
        store.D_playerScores.createIndex('teamGameTypeRank', ['teamID', 'gameTypeID', 'scoreIsFinal', 'overallRank'], { unique: false });
        store.D_playerScores.createIndex('teamID', 'teamID', { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: players

        store.D_players = scoredDB.createObjectStore('D_players', { keyPath: 'id' });
        store.D_players.createIndex('blocked', 'blocked', { unique: false });
        store.D_players.createIndex('createdAt', 'createdAt', { unique: false });
        store.D_players.createIndex('createdBy', 'createdBy', { unique: false });
        store.D_players.createIndex('familyName', 'familyName', { unique: false });
        store.D_players.createIndex('givenName', 'givenName', { unique: false });
        store.D_players.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.D_players.createIndex('nickname', 'nickname', { unique: true });
        store.D_players.createIndex('normalisedName', 'normalisedName', { unique: true });
        store.D_players.createIndex('updatedBy', 'updatedBy', { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: teams

        store.D_teams = scoredDB.createObjectStore('D_teams', { keyPath: 'id' });
        store.D_teams.createIndex('blocked', 'blocked', { unique: false });
        store.D_teams.createIndex('createdAt', 'createdAt', { unique: false });
        store.D_teams.createIndex('createdBy', 'createdBy', { unique: false });
        store.D_teams.createIndex('memberCount', 'memberCount', { unique: false });
        store.D_teams.createIndex('name', 'name', { unique: true });
        store.D_teams.createIndex('normalisedName', 'normalisedName', { unique: true });
        store.D_teams.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.D_teams.createIndex('updatedBy', 'updatedBy', { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: player/game (join)

        store.J_playerGame = scoredDB.createObjectStore('J_playerGame', { keyPath: 'id' });
        store.J_playerGame.createIndex('gamePlayer', ['gameID', 'playerID'], { unique: true });
        store.J_playerGame.createIndex('gameOrder', ['gameID', 'order'], { unique: true });
        store.J_playerGame.createIndex('gamePlayerID', 'playerID', { unique: false });
        store.J_playerGame.createIndex('gameTeam', 'teamID', { unique: false });
        store.J_playerGame.createIndex('gameType', 'gameTypeID', { unique: false });
        store.J_playerGame.createIndex('gameTypePlayer', ['gameTypeID', 'playerID'], { unique: false });
        store.J_playerGame.createIndex('gameTypeTeam', ['gameTypeID', 'teamID'], { unique: false });
        store.J_playerGame.createIndex('gameOrder', ['playerID', 'order'], { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: player/team (join)

        store.J_playerTeam = scoredDB.createObjectStore('J_playerTeam', { keyPath: 'id' });
        store.J_playerTeam.createIndex('teamPlayer', ['teamID', 'playerID'], { unique: true });
        store.J_playerTeam.createIndex('teamPosition', ['teamID', 'position'], { unique: true });
        store.J_playerTeam.createIndex('playerTeamPlayerID', 'playerID', { unique: false });
        store.J_playerTeam.createIndex('playerTeamTeamID', 'teamID', { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: game permissions modes (enum)

        store.E_gamePermissionsModes = scoredDB.createObjectStore('E_gamePermissionsModes', { keyPath: 'id' });
        store.E_gamePermissionsModes.createIndex('key', 'key', { unique: true });

        // ----------------------------------------------------------
        // CREATE STORE: game states (enum)

        store.E_gameStates = scoredDB.createObjectStore('E_gameStates', { keyPath: 'id' });
        store.E_gameStates.createIndex('key', 'key', { unique: true });
        store.E_gameStates.createIndex('XXXXXXX', 'XXXXXXX', { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: player types (enum)

        store.E_playerTypes = scoredDB.createObjectStore('E_playerTypes', { keyPath: 'id' });
        store.E_playerTypes.createIndex('key', 'key', { unique: true });
        store.E_gameStates.createIndex('label', 'label', { unique: false });

        // ----------------------------------------------------------
        // CREATE STORE: score control modes (enum)

        store.E_scoreControlModes = scoredDB.createObjectStore('E_scoreControlModes', { keyPath: 'id' });
        store.E_scoreControlModes.createIndex('key', 'key', { unique: true });

        // ----------------------------------------------------------
      } else {
        setScoredDB(event);
      }
    }
  }

  return scoredDB;
}

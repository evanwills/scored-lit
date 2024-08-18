// import { EAppStates } from "../redux/app-state";
// import { TScoredStore } from "../types/game-data";

let scoredDB : IDBDatabase | null = null;

type scoredDBStore = {
  currentGame: IDBObjectStore | null,
  customGames: IDBObjectStore | null,
  gameTypes: IDBObjectStore | null,
  pastGames: IDBObjectStore | null,
  players: IDBObjectStore | null,
  teams: IDBObjectStore | null,
}

let currentGame : IDBObjectStore;

const store : scoredDBStore = {
  currentGame: null,
  customGames: null,
  gameTypes: null,
  pastGames: null,
  players: null,
  teams: null,
  // playerPastgame: null,
  // teamPastgame: null,
  // playerTeam: null,
  // pastgameGametype: null,
  // playerGametype: null,
  // teamGametype: null,
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
        // Create current game store
        store.currentGame = scoredDB.createObjectStore('currentGame');

        // Create custom game store
        store.customGames = scoredDB.createObjectStore('customGames', { keyPath: 'id' });
        store.customGames.createIndex('name', 'name', { unique: true });
        store.customGames.createIndex('maxPlayers', 'maxPlayers', { unique: false });
        store.customGames.createIndex('minPlayers', 'minPlayers', { unique: false });
        store.customGames.createIndex('requiresTeam', 'requiresTeam', { unique: false });

        // Create game type store
        store.gameTypes = scoredDB.createObjectStore('gameTypes', { keyPath: 'id' });
        store.customGames.createIndex('name', 'name', { unique: true });
        store.customGames.createIndex('maxPlayers', 'maxPlayers', { unique: false });
        store.customGames.createIndex('minPlayers', 'minPlayers', { unique: false });
        store.customGames.createIndex('requiresTeam', 'requiresTeam', { unique: false });

        // Create past games store
        store.pastGames = scoredDB.createObjectStore('pastGames', { keyPath: 'id' });
        store.pastGames.createIndex('end', 'end', { unique: false });
        store.pastGames.createIndex('forced', 'forced', { unique: false });
        store.pastGames.createIndex('looser', 'looser', { unique: false });
        store.pastGames.createIndex('start', 'start', { unique: false });
        store.pastGames.createIndex('teams', 'teams', { unique: false });
        store.pastGames.createIndex('type', 'type', { unique: false });
        store.pastGames.createIndex('winner', 'winner', { unique: false });

        // Create player store
        store.players = scoredDB.createObjectStore('players', { keyPath: 'id' });

        // Create team store
        store.teams = scoredDB.createObjectStore('teams', { keyPath: 'id' });

        // Create a team-player link store
        // Create a pastGames-player link store
        // Create a pastGames-team link store
        // Create a pastGames-gameType link store
        // Create a player-gameType link store
        // Create a team-gameType link store
      } else {
        setScoredDB(event);
      }
    }
  }

  return scoredDB;
}

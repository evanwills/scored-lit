import { IGameRules, TLead } from "../types/game-rules";
import { TCall } from "../types/game-rules";
import { TScoreCard } from "../types/score-card";


/**
 * Get the true score from a 500 had based on number of tricks won
 *
 * @param score Number of tricks won
 * @param lead  Whether or not player won the call
 * @param call  Info about the call that won the lead
 *
 * @returns The true score for the player.
 */
export const get500Score = (score: number, lead: boolean = false, call: TCall|null) : number => {
  if (call === null) {
    throw new Error(
      '500.getScore() expects third parameter call not to be null',
    );
  }

  if (call.id === 'M' || call.id === 'OM') {
    if (lead === false) {
      return 0;
    }

    return (score > 0)
      ? call.score * -1
      : call.score;
  }

  if (lead === false) {
    return score * 10;
  }

  return (score >= call.tricks)
    ? call.score * -1
    : call.score;
};

/**
 * Get the player/team object matching the player ID
 *
 * @param players  List of players for the game.
 * @param playerID ID of player/team being requested
 *
 * @returns A single player/team object if matched by ID or
 *          NULL if ID could not be matched
 */
export const getPlayer = (players : Array<TScoreCard>, playerID : string) : TScoreCard|null => {
  for (let a = 0; a < players.length; a += 1) {
    if (players[a].id === playerID) {
      return players[a];
    }
  }
  return null;
};

/**
 * Get error message when unknown player ID has been supplied
 *
 * @param method   Name of method that will throw the error
 * @param playerID ID of player/team that could not be found
 *
 * @returns Message to use when throwing an error.
 */
export const getPlayerError = (method: string, playerID: string) : string => {
  return `500.${method}() expects argument \`playerID\` to be the ` +
         `name of a known player for this game. "${playerID}" did ` +
         'not match any known players';
};

/**
 * Get error message when lead has not been set for current hand
 *
 * @param method   Name of method that will throw the error
 *
 * @returns Message to use when throwing an error.
 */
export const getLeadError = (method: string) : string => {
  return `500.${method}() expects lead to have already been set ` +
         'for this hand. Lead has not yet been set.';
}

/**
 * Set the position/rank of players based on their score.
 *
 * @param players list of players in game
 *
 * @returns Updated list of players with latest ranking set.
 */
export const rankPlayers = (players: Array<TScoreCard>) : Array<TScoreCard> => {
  const ranking = players.map((player, index) => ({i, index, id: player.id, total: player.total, rank: 0}));

  // Sort players from highest to lowest by their score
  ranking.sort((a, b) => {
    if (a.total > b.total) {
      return 1;
    } else if (a.total < b.total) {
      return -1;
    } else {
      return 0;
    }
  });

  // Set players rank based on their sorted position
  for (let a = 0; a < ranking.length; a += 1) {
    ranking[a].rank = a + 1;
  }

  // Put players back in their original order
  ranking.sort((a, b) => {
    if (a.i > b.i) {
      return 1;
    } else if (a.i < b.i) {
      return -1;
    } else {
      return 0;
    }
  });

  return players.map((player, index) => {
    if (player.id !== ranking[index].id) {
      throw new Error(
        `Player ${player.id} could not be ranked because ID ` +
        'didn\'t match rank ID.',
      );
    }

    return {
      ...player,
      position: ranking[index].rank
    };
  });
}

export const updateScoreAndRank = (players: Array<TScoreCard>, player: TScoreCard, newScores: Array<number>) => {

  const _tmp = {
    ...player,
    scores: newScores,
    total: newScores.reduce((_total, _score) => (_total + _score), 0),
  };

  return {
    players: rankPlayers(
      players.map((_player) => (_player.id === _tmp.id) ? _player : _tmp)
    ),
    player: _tmp,
  };
};

export class FiveHundred implements IGameRules {
  // ================================================================
  // START: property declarations

  // ----------------------------------------------------------------
  // START: private property declarations

  _gameOver: boolean = false;
  _players: Array<TScoreCard> = [];
  _lead: TLead|null = null;
  _pastLeads: Array<TLead> = [];
  _winner: string = '';
  _looser: string = '';

  //  END:  private property declarations
  // ----------------------------------------------------------------
  // START: public property declarations

  readonly name: string = '500';
  readonly rules: string = '';
  readonly maxPlayers: number|null = 2;
  readonly maxScore: number|null = 500;
  readonly minPlayers: number = 2;
  readonly minScore: number|null = -500;
  readonly onlyWinOnCall: boolean = true;
  readonly requiresCall: boolean = true;
  readonly possibleCalls: Array<TCall> = [
    { id: '6S', name: 'Six spades', score: 40, tricks: 6 },
    { id: '6C', name: 'Six clubs', score: 60, tricks: 6 },
    { id: '6D', name: 'Six diamonds', score: 80, tricks: 6 },
    { id: '6H', name: 'Six hearts', score: 100, tricks: 6 },
    { id: '6NT', name: 'Six no trumps', score: 120, tricks: 6 },
    { id: '7S', name: 'Seven spades', score: 140, tricks: 7 },
    { id: '7C', name: 'Seven clubs', score: 160, tricks: 7 },
    { id: '7D', name: 'Seven diamonds', score: 180, tricks: 7 },
    { id: '7H', name: 'Seven hearts', score: 200, tricks: 7 },
    { id: '7NT', name: 'Seven no trumps', score: 220, tricks: 7 },
    { id: 'M', name: 'Misere', score: 250, tricks: 10 },
    { id: '8S', name: 'Eight spades', score: 240, tricks: 8 },
    { id: '8C', name: 'Eight clubs', score: 260, tricks: 8 },
    { id: '8D', name: 'Eight diamonds', score: 280, tricks: 8 },
    { id: '8H', name: 'Eight hearts', score: 300, tricks: 8 },
    { id: '8NT', name: 'Eight no trumps', score: 320, tricks: 8 },
    { id: '9S', name: 'Nine spades', score: 340, tricks: 9 },
    { id: '9C', name: 'Nine clubs', score: 360, tricks: 9 },
    { id: '9D', name: 'Nine diamonds', score: 380, tricks: 9 },
    { id: '9H', name: 'Nine hearts', score: 400, tricks: 9 },
    { id: '9NT', name: 'Nine no trumps', score: 420, tricks: 9 },
    { id: '10S', name: 'Ten spades', score: 440, tricks: 10 },
    { id: '10C', name: 'Ten clubs', score: 460, tricks: 10 },
    { id: '10D', name: 'Ten diamonds', score: 480, tricks: 10 },
    { id: '10H', name: 'Ten hearts', score: 500, tricks: 10 },
    { id: '10NT', name: 'Ten no trumps', score: 520, tricks: 10 },
    { id: 'OM', name: 'Open misere', score: 500, tricks: 10 },
  ];

  //  END:  public property declarations
  // ----------------------------------------------------------------

  //  END:  property declarations
  // ================================================================
  // START: method declarations

  constructor(players: Array<string>) {
    this.gameOver = () => this._gameOver;
    this._players = players.map((player) => ({
      id: player,
      scores: [],
      total: 0,
      position: 0;
    }));
  }

  canPlay () : boolean {
    return this._lead !== null && this._gameOver === false;
  };

  gameOver () : boolean {
    if (this._gameOver === false) {
      for (let a = 0; a < this._players.length; a += 1) {
        if (this._players[a].total >= 500) {
          this._winner = this._players[a].id;
          this._gameOver = true;
        } else if (this._players[a].total <= -500) {
          this._looser = this._players[a].id;
          this._gameOver = true;
          break;
        }
      }
    }

    return this._gameOver
  };

  getCalls () : Array<TCall> {
    return this.possibleCalls;
  };

  getCall (id: string) : TCall|null {
    const output = this.possibleCalls.filter((call) => call.id === id || call.name === id);
    return (output.length > 0)
      ? output[0]
      : null;
  };

  getLooser () : string {
    return (this.gameOver() === true)
      ? this._looser
      : '';
  };

  getScore (score: number, playerID: string) : number {
    if (this._lead === null) {
      throw new Error(getLeadError('setScore'));
    }
    if (getPlayer(this._players, playerID) === null) {
      throw new Error(getPlayerError('setLead', playerID));
    }

    return get500Score(score, (playerID === this._lead.playerID), this._lead);
  };

  getWinner () : string {
    return (this.gameOver() === true)
      ? this._winner
      : '';
  };

  setLead (playerID: string, call: string) : void {
    if (this._lead !== null) {
      this._pastLeads = [...this._pastLeads, this._lead];
    }

    this._lead = null;
    const player = getPlayer(this._players, playerID);

    if (player === null) {
      throw new Error(getPlayerError('setLead', playerID));
    }

    for (let a = 0; a < this.possibleCalls.length; a += 1) {
      if (this.possibleCalls[a].id === call || this.possibleCalls[a].name === call) {
        this._lead = {
          ...this.possibleCalls[a],
          playerID: playerID,
        };
        break;
      }
    }

    if (this._lead === null) {
      throw new Error(
        '500.setLead() expects second argument `call` to be the ' +
        `the ID or name of a known 500 call. "${call}" did not ` +
        'match any known 500 calls',
      );
    }
  };

  setScore (playerID: string, score: number) : number {
    const tmp = getPlayer(this._players, playerID);
    if (tmp === null) {
      throw new Error(getPlayerError('setScore', playerID));
    }
    if (this._lead === null) {
      throw new Error(getLeadError('setScore'));
    }
    const isLead = (playerID === this._lead.playerID);

    return this._updateRankAndScore(
      tmp,
      [
        ...tmp.scores,
        get500Score(score, isLead, this._lead),
      ]
    );
  };

  updateScore (playerID: string, score: number, round: number) : number {
    const tmp = getPlayer(this._players, playerID);
    const _r = round - 1;
    if (tmp === null) {
      throw new Error(getPlayerError('setScore', playerID));
    }
    const lead = (round === this._pastLeads.length)
      ? this._lead
      : this._pastLeads[_r];

    if (typeof lead === 'undefined' || lead === null) {
      throw new Error(
        `500.updateScore() could not determin lead for round ${round}`,
      );
    }
    const isLead = (playerID === lead.playerID);

    return this._updateRankAndScore(
      tmp,
      tmp.scores.map((_score, _index) => (_r === _index)
        ? get500Score(score, isLead, this._lead)
        : _score
      ),
    );
  };

  _updateRankAndScore (player: TScoreCard, newScores: Array<number>) : number {
    const _tmp = {
      ...player,
      scores: newScores,
      total: newScores.reduce((_total, _score) => (_total + _score), 0),
    };

    this._players = rankPlayers(
      this._players.map((_player) => (_player.id === _tmp.id) ? _player : _tmp)
    );

    return _tmp.total;
  }
}

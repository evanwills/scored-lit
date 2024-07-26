import { createSlice } from '@reduxjs/toolkit';
import { getLocalValue } from '../../utils/storage-utils';
import { IGameRuleData, IGameRules } from '../../types/game-rules';
import { FiveHundred } from '../../game-rules/500';
import { AnyIndividual } from '../../game-rules/any-individual';
import { AnyTeam } from '../../game-rules/any-teams';
import { CrazyEights } from '../../game-rules/crazy-eights';
import { gameFinder, gameUpdater } from '../game-utils';


const customGames : Array<IGameRuleData> = getLocalValue('customGame', [], 'object|null');

const getRule = (preBuilt : IGameRules) : IGameRuleData => ({
  id: preBuilt.id,
  lowestWins: preBuilt.lowestWins,
  maxPlayers: preBuilt.maxPlayers,
  maxScore: preBuilt.maxScore,
  minPlayers: preBuilt.minPlayers,
  minScore: preBuilt.minScore,
  name: preBuilt.name,
  callToWin: preBuilt.callToWin,
  possibleCalls: preBuilt.possibleCalls,
  requiresTeam: preBuilt.requiresTeam,
  requiresCall: preBuilt.requiresCall,
  rules: preBuilt.rules,
});

const initialState : Array<IGameRuleData> = [
  getRule(new FiveHundred([])),
  getRule(new AnyIndividual([])),
  getRule(new AnyTeam([])),
  getRule(new CrazyEights([])),
  // getRule(new GinRummy([])),
  ...customGames
];

export const gameRulesSlice = createSlice({
  name: 'gameRules',
  initialState,
  reducers: {
    GAME_RULES_SET: (state, _action) => {
      const nameOrID = state.find(
        gameFinder(_action.payload.name, _action.payload.id),
      );

      if (typeof nameOrID !== 'undefined') {
        throw new Error(
          `Could not create new custom game "${_action.payload.name}" `
          + 'because another game is already using that name',
        );
      }

      return [...state, _action.payload];
    },
    GAME_RULES_DELETE: (state, _action) => state.filter(
      gameFinder(_action.payload.name, _action.payload.id),
    ),
    GAME_RULES_UPDATE: (state, _action) => state.map(gameUpdater(_action.payload)),
  },
});

export const { GAME_RULES_SET, GAME_RULES_DELETE, GAME_RULES_UPDATE } = gameRulesSlice.actions;

export default gameRulesSlice.reducer;

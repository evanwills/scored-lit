import { describe, expect, test } from 'vitest';
import { getFilterPlayersByName } from '../../src/utils/player-utils'
import { IIndividualPlayer } from '../../src/types/players';

const players = [
  { id: 'DsaGJXvfavRJLjMCCKgIv', name: 'Evan', secondName: '', normalisedName: 'evan'},
  { id: '-ZYd2yScYkOgLCVU8aDpP', name: 'Georgie', secondName: '', normalisedName: 'georgie'},
  { id: 'ZwRyWeWNje-1JxKE_hhiW', name: 'Mallee', secondName: '', normalisedName: 'mallee'},
  { id: 'khx9ZsrHr3cNn9DGBCgRB', name: 'Ada', secondName: '', normalisedName: 'ada'},
  { id: 'NIGhDSx4bVUfRrUCFe9MT', name: 'Carmel', secondName: '', normalisedName: 'carmel'},
  { id: 'RNyNQ0siFUTooQSVMsiHd', name: 'Jess', secondName: '', normalisedName: 'jess'},
  { id: 'LI_IT_gg_rkOggWn0sf2R', name: 'Stu', secondName: '', normalisedName: 'stu'},
  { id: '2m1HyyzigyDeK9ojvSW3q', name: 'Ally', secondName: '', normalisedName: 'ally'},
  { id: 'f2CmGuyOP6U0b_6S1uI91', name: 'Matt', secondName: '', normalisedName: 'matt'},
];

describe(
  'getFilterPlayersByName() returns function that can be used in Array.filter',
  () => {
    const filter = getFilterPlayersByName('a');

    test(
      'output of `getFilterPlayersByName is a function',
      () => {
        expect(filter).toBeTypeOf('function');
      },
    );

    const vals = [
      ['a', 6],
      ['al', 2],
      ['e', 5],
      ['ev', 1],
      ['m', 3],
    ];

    test.each(vals)(
      'Players filtered on "%s" returns list of %i players',
      (a, expected) => {
        const output : IIndividualPlayer[] =  players.filter(getFilterPlayersByName(a as string));

        expect(output.length).toBe(expected);
      }
    )
  },
)

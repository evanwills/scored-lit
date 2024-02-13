/**
 * Get the sum of all the scores up to and including the round being
 * rendered.
 *
 * @param scores List of scores for a single player
 * @param index  Index of the round the scores should be summed to.
 *
 * @returns Sum of the scores up to the round identified by the index
 */
export const sumScores = (scores: number[], index: number = 99999) : number => {
  const max = (index < scores.length)
    ? index
    : scores.length;

  let output = 0;


  for (let a = 0; a < max; a += 1) {
    output += scores[a];
  }

  return output;
};

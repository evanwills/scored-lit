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


export const setLocalValue = (key : string, value : any) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const getLocalValue = (key : string, defaultVal : any) : any => {
  if (typeof localStorage !== 'undefined') {
    const output = localStorage.getItem(key);

    if (output !== null) {
      return output;
    }

    setLocalValue(key, defaultVal);
  }

  return defaultVal;
};

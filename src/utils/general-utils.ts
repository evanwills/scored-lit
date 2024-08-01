import { FEpre } from "../types/general";
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

export const isNum = (input : any) : boolean => (typeof input === 'number' && !Number.isNaN(input) && Number.isFinite(input));

/**
 * Get a function that returns the start of an error message
 * (or console group name) string for a given method
 *
 * @param componentName Name of the component `ePre()` is
 *                               being called from
 * @param componentID   ID of component (if component is
 *                               used multiple times on a page)
 *
 * @returns {}
 */
export const getEpre = (componentName : string, componentID = '') : FEpre => {
  const tail = (componentID !== '')
    ? ` (#${componentID})`
    : '';

  return (method : string, before : boolean|string|null = null) : string => {
    let suffix = '';

    if (typeof before === 'boolean') {
      suffix = (before === true)
        ? ' (before)'
        : ' (after)';
    } else if (typeof before === 'string') {
      const _before = before.trim();

      if (_before !== '') {
        suffix = ` ("${_before}")`;
      }
    }

    return `${componentName}.${method}()${tail}${suffix} `;
  };
};

/**
 *
 * @param {string[]} keys
 * @returns {(results) => {}}
 */
export function arrayToMap(keys: string[]) {
  return results => {
    return results.reduce((acc, result, i) => {
      acc[keys[i]] = result;
      return acc;
    }, {});
  };
}

/**
 *
 * @param {any[]} array
 * @param {number} chunkSize
 * @returns {any[]}
 */
export function split(array: any[], chunkSize: number) {
  if (chunkSize <= 0) {
    throw Error(`chunkSize(${chunkSize}) parameter should be > 0`);
  }
  return [].concat.apply(
    [],
    array.map((elem, i) => {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    }),
  );
}

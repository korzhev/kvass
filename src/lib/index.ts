export interface IMap {
  [key: string]: any;
}
/**
 *
 * @param keys
 */
export function arrayToMapFunc(keys: string[]): (results: any) => any {
  return (results: any[]) => {
    return results.reduce((acc: IMap, result: any, i: number) => {
      acc[keys[i]] = result;
      return acc;
    }, {});
  };
}

/**
 *
 * @param array
 * @param chunkSize
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

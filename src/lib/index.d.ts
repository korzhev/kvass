export interface IMap {
    [key: string]: any;
}
/**
 *
 * @param keys
 */
export declare function arrayToMapFunc(keys: string[]): (results: any) => any;
/**
 *
 * @param array
 * @param chunkSize
 */
export declare function split(array: any[], chunkSize: number): any;

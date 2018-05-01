export declare type AP = Array<Promise<any>>;
export declare type IFaP = Iterable<(value?: any) => Promise<any>>;
export declare type IFAP = Iterable<(value: any) => Promise<any>>;
export declare type IFP = Iterable<() => Promise<any>>;
export declare type IP = Iterable<Promise<any>>;
export interface IObjectPromise {
    [key: string]: Promise<any>;
}
export interface ITimeoutWrapper {
    timeout: any;
}
/**
 *
 * @param promises
 */
export declare function waterfall(promises: IFaP): Promise<any>;
export declare function tap(cb: (value: any) => Promise<any>): (arg: any) => Promise<any>;
/**
 *
 * @param promises
 */
export declare function series(promises: IP): Promise<any>;
/**
 *
 * @param promises
 * @param args
 */
export declare function seriesApply(promises: IFAP, args: Iterable<any>): Promise<any>;
/**
 *
 * @param time
 * @param timeoutWrap
 */
export declare function wait(time: number, timeoutWrap?: {
    timeout: number;
}): Promise<{}>;
/**
 *
 * @param promises
 */
export declare function props(promises: IObjectPromise): Promise<object>;
/**
 *
 * @param p
 * @param cb
 */
export declare function silence(p: AP, cb?: () => void): AP;
/**
 *
 * @param pFunc
 * @param times
 */
export declare function retry(pFunc: () => Promise<any>, times?: number): Promise<any>;
/**
 *
 * @param pFunc
 * @param times
 * @param time
 * @param timeout
 */
export declare function retryWithPause(pFunc: () => Promise<any>, times?: number, time?: number, timeout?: ITimeoutWrapper): Promise<any>;
/**
 *
 * @param pFunc
 * @param times
 */
export declare function repeat(pFunc: () => Promise<any>, times?: number): Promise<any[]>;
/**
 *
 * @param pFunc
 * @param times
 * @param time
 * @param timeout
 */
export declare function repeatWithPause(pFunc: () => Promise<any>, times?: number, time?: number, timeout?: ITimeoutWrapper): Promise<any[]>;
/**
 *
 * @param p
 */
export declare function mapSeries(p: IP): Promise<any[]>;
/**
 *
 * @param p
 * @param limit
 */
export declare function parallelLimit(p: IP, limit: number): Promise<any[]>;

import { arrayToMap, split } from './lib';

export type AP = Array<Promise<any>>;
export type IFaP = Iterable<(value?: any) => Promise<any>>;
export type IFAP = Iterable<(value: any) => Promise<any>>;
export type IP = Iterable<() => Promise<any>>;

export interface IObjectPromise {
  [key: string]: Promise<any>;
}

export interface ITimeoutWrapper {
    timeout: any;
}

/**
 *
 * @param {IFaP} promises
 * @returns {Promise<any>}
 */
export function waterfall(promises: IFaP) :Promise<any>{
  let result = Promise.resolve();
  for (const p of promises) {
    result = result.then(p);
  }
  return result;
}

export function tap(cb: (value: any) => Promise<any>) {
  return (arg: any) => cb(arg).then(() => arg);
}

/**
 *
 * @param {IP} promises
 * @returns {Promise<void>}
 */
export function series(promises: IP) :Promise<any>{
  let result = Promise.resolve();
  for (const p of promises) {
    result = result.then(() => p());
  }
  return result;
}

/**
 *
 * @param {IFAP} promises
 * @param {Iterable<any>} args
 * @returns {Promise<any>}
 */
export function seriesApply(promises: IFAP, args: Iterable<any>) :Promise<any> {
  let result = Promise.resolve();
  const i = args[Symbol.iterator]();
  for (const p of promises) {
    const arg = i.next();
    result = result.then(() => p(arg.value));
  }
  return result;
}

/**
 *
 * @param {number} time
 * @param timeoutWrap
 * @returns {Promise<any>}
 */
export function wait(time: number, timeoutWrap?: ITimeoutWrapper ) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, time);
    if (arguments.length === 2) {
        timeoutWrap.timeout = t;
    }
  });
}

/**
 *
 * @param {AP | IObjectPromise} p
 * @returns {AP | IObjectPromise}
 */
// export function reflect<T>(p: AP | IObjectPromise) :Promise<any>{
//   if (Array.isArray(p)) {
//     return p.map(promise => promise.catch(e => e));
//   }
//   const keys = Object.keys(p);
//   return keys.reduce((acc, key) => {
//     acc[key] = p[key].catch(e => e);
//     return acc;
//   }, {});
// }

/**
 *
 * @param {IObjectPromise} promises
 * @returns {Promise<object>}
 */
export function props(promises: IObjectPromise): Promise<object> {
  const keys = Object.keys(promises);
  const list = keys.map(key => promises[key]);
  return Promise.all(list).then(arrayToMap(keys));
}

const mute = () => {
  /**/
};
/**
 *
 * @param {AP | IObjectPromise} p
 * @param {() => any} cb
 * @returns {AP | IObjectPromise}
 */
export function silence(p: AP, cb = mute) :AP {
  if (Array.isArray(p)) {
    return p.map(promise => promise.catch(cb));
  }
}

/**
 *
 * @param {Promise<any>} p
 * @param {number} times
 * @returns {Promise<any>}
 */
export async function retry(p: Promise<any>, times = Infinity) {
  let i = 1;
  let err;
  let result;
  while (i++ < times && result === undefined) {
    try {
      result = await p;
    } catch (e) {
      err = e;
    }
  }
  if (err) {
    throw err;
  }
  return result;
}

/**
 *
 * @param {Promise<any>} p
 * @param {number} time
 * @param {number} times
 * @param timeout
 * @returns {Promise<any>}
 */
export async function retryWithPause(p: Promise<any>, time = 100, times = Infinity, timeout?: any) {
  let i = 1;
  let err;
  let result;
  while (i++ < times && result === undefined) {
    try {
      await wait(time, timeout);
      result = await p;
    } catch (e) {
      err = e;
    }
  }
  if (err) {
    throw err;
  }
  return result;
}

/**
 *
 * @param {Promise<any>} p
 * @param {number} times
 * @returns {Promise<any[]>}
 */
export async function repeat(p: Promise<any>, times = Infinity) {
  let i = 1;
  const result = [];
  while (i++ < times) {
    const promiseResult = await p;
    result.push(promiseResult);
  }
  return result;
}

/**
 *
 * @param {Promise<any>} p
 * @param {number} time
 * @param {number} times
 * @param timeout
 * @returns {Promise<any[]>}
 */
export async function repeatWithPause(
  p: Promise<any>,
  time = 100,
  times = Infinity,
  timeout?: any,
) {
  let i = 1;
  const result = [];
  while (i++ < times) {
    await wait(time, timeout);
    const promiseResult = await p;
    result.push(promiseResult);
  }
  return result;
}

/**
 *
 * @param {IP} p
 * @returns {Promise<any[]>}
 */
export async function mapSeries(p: IP) {
  const result = [];
  for (const promise of p) {
    const promiseResult = await promise;
    result.push(promiseResult);
  }
  return result;
}

/**
 *
 * @param {IP} p
 * @param {number} limit
 * @returns {Promise<any[]>}
 */
export async function parallelLimit(p: IP, limit: number) {
  let result = [];
  const list = [...p];

  const tmp = split(list, Math.ceil(list.length / limit));
  const length = tmp.length;
  for (let i = 0; i < length; i++) {
    const tmpResult = await Promise.all(tmp[i]);
    result = result.concat(tmpResult);
  }
  return result;
}

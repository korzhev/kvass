import { arrayToMapFunc, split } from './lib';

export type AP = Array<Promise<any>>;
export type IFaP = Iterable<(value?: any) => Promise<any>>;
export type IFAP = Iterable<(value: any) => Promise<any>>;
export type IFP = Iterable<() => Promise<any>>;
export type IP = Iterable<Promise<any>>;

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
export function waterfall(promises: IFaP): Promise<any> {
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
 * @param promises
 */
export function series(promises: IP): Promise<any> {
  let result = Promise.resolve();
  for (const p of promises) {
    result = result.then(() => p);
  }
  return result;
}

/**
 *
 * @param promises
 * @param args
 */
export function seriesApply(promises: IFAP, args: Iterable<any>): Promise<any> {
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
 * @param time
 * @param timeoutWrap
 */
export function wait(time: number, timeoutWrap = { timeout: 0 }) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, time);
    if (arguments.length === 2) {
      timeoutWrap.timeout = t;
    }
  });
}

/**
 *
 * @param promises
 */
export function props(promises: IObjectPromise): Promise<object> {
  const keys = Object.keys(promises);
  const list = keys.map(key => promises[key]);
  return Promise.all(list).then(arrayToMapFunc(keys));
}

const mute = () => {
  /**/
};
/**
 *
 * @param p
 * @param cb
 */
export function silence(p: AP, cb = mute): AP {
  if (Array.isArray(p)) {
    return p.map(promise => promise.catch(cb));
  }
  return [];
}

/**
 *
 * @param pFunc
 * @param times
 */
export function retry(pFunc: () => Promise<any>, times = 500) {
  let p = pFunc();
  for (let i = 1; i < times; i++) {
    p = p.catch(pFunc);
  }
  return p;
}

/**
 *
 * @param pFunc
 * @param times
 * @param time
 * @param timeout
 */
export async function retryWithPause(
  pFunc: () => Promise<any>,
  times = 200,
  time = 100,
  timeout?: ITimeoutWrapper,
) {
  let p = pFunc();
  for (let i = 1; i < times; i++) {
    p = p.catch(() => wait(time, timeout)).then(pFunc);
  }
  return p;
}

/**
 *
 * @param pFunc
 * @param times
 */
export async function repeat(pFunc: () => Promise<any>, times = 200) {
  let i = 0;
  const result = [];
  while (i++ < times) {
    const promiseResult = await pFunc();
    result.push(promiseResult);
  }
  return result;
}

/**
 *
 * @param pFunc
 * @param times
 * @param time
 * @param timeout
 */
export async function repeatWithPause(
  pFunc: () => Promise<any>,
  times = 200,
  time = 100,
  timeout?: ITimeoutWrapper,
) {
  let i = 0;
  const result = [];
  while (i++ < times) {
    await wait(time, timeout);
    const promiseResult = await pFunc();
    result.push(promiseResult);
  }
  return result;
}

/**
 *
 * @param p
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
 * @param p
 * @param limit
 */
export async function parallelLimit(p: IP, limit: number) {
  let result: any[] = [];
  const list = p instanceof Array ? p : [...p];

  const tmp = split(list, Math.ceil(list.length / limit));
  const length = tmp.length;
  for (let i = 0; i < length; i++) {
    const tmpResult = await Promise.all(tmp[i]);
    result = result.concat(tmpResult);
  }
  return result;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
/**
 *
 * @param {IFaP} promises
 * @returns {Promise<any>}
 */
function waterfall(promises) {
    let result = Promise.resolve();
    for (const p of promises) {
        result = result.then(p);
    }
    return result;
}
exports.waterfall = waterfall;
function tap(cb) {
    return (arg) => cb(arg).then(() => arg);
}
exports.tap = tap;
/**
 *
 * @param {IP} promises
 * @returns {Promise<void>}
 */
function series(promises) {
    let result = Promise.resolve();
    for (const p of promises) {
        result = result.then(() => p());
    }
    return result;
}
exports.series = series;
/**
 *
 * @param {IFAP} promises
 * @param {Iterable<any>} args
 * @returns {Promise<any>}
 */
function seriesApply(promises, args) {
    let result = Promise.resolve();
    const i = args[Symbol.iterator]();
    for (const p of promises) {
        const arg = i.next();
        result = result.then(() => p(arg.value));
    }
    return result;
}
exports.seriesApply = seriesApply;
/**
 *
 * @param {number} time
 * @param timeoutWrap
 * @returns {Promise<any>}
 */
function wait(time, timeoutWrap) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(resolve, time);
        if (arguments.length === 2) {
            timeoutWrap.timeout = t;
        }
    });
}
exports.wait = wait;
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
function props(promises) {
    const keys = Object.keys(promises);
    const list = keys.map(key => promises[key]);
    return Promise.all(list).then(lib_1.arrayToMap(keys));
}
exports.props = props;
const mute = () => {
    /**/
};
/**
 *
 * @param {AP | IObjectPromise} p
 * @param {() => any} cb
 * @returns {AP | IObjectPromise}
 */
function silence(p, cb = mute) {
    if (Array.isArray(p)) {
        return p.map(promise => promise.catch(cb));
    }
}
exports.silence = silence;
/**
 *
 * @param {Promise<any>} p
 * @param {number} times
 * @returns {Promise<any>}
 */
async function retry(p, times = Infinity) {
    let i = 1;
    let err;
    let result;
    while (i++ < times && result === undefined) {
        try {
            result = await p;
        }
        catch (e) {
            err = e;
        }
    }
    if (err) {
        throw err;
    }
    return result;
}
exports.retry = retry;
/**
 *
 * @param {Promise<any>} p
 * @param {number} time
 * @param {number} times
 * @param timeout
 * @returns {Promise<any>}
 */
async function retryWithPause(p, time = 100, times = Infinity, timeout) {
    let i = 1;
    let err;
    let result;
    while (i++ < times && result === undefined) {
        try {
            await wait(time, timeout);
            result = await p;
        }
        catch (e) {
            err = e;
        }
    }
    if (err) {
        throw err;
    }
    return result;
}
exports.retryWithPause = retryWithPause;
/**
 *
 * @param {Promise<any>} p
 * @param {number} times
 * @returns {Promise<any[]>}
 */
async function repeat(p, times = Infinity) {
    let i = 1;
    const result = [];
    while (i++ < times) {
        const promiseResult = await p;
        result.push(promiseResult);
    }
    return result;
}
exports.repeat = repeat;
/**
 *
 * @param {Promise<any>} p
 * @param {number} time
 * @param {number} times
 * @param timeout
 * @returns {Promise<any[]>}
 */
async function repeatWithPause(p, time = 100, times = Infinity, timeout) {
    let i = 1;
    const result = [];
    while (i++ < times) {
        await wait(time, timeout);
        const promiseResult = await p;
        result.push(promiseResult);
    }
    return result;
}
exports.repeatWithPause = repeatWithPause;
/**
 *
 * @param {IP} p
 * @returns {Promise<any[]>}
 */
async function mapSeries(p) {
    const result = [];
    for (const promise of p) {
        const promiseResult = await promise;
        result.push(promiseResult);
    }
    return result;
}
exports.mapSeries = mapSeries;
/**
 *
 * @param {IP} p
 * @param {number} limit
 * @returns {Promise<any[]>}
 */
async function parallelLimit(p, limit) {
    let result = [];
    const list = [...p];
    const tmp = lib_1.split(list, Math.ceil(list.length / limit));
    const length = tmp.length;
    for (let i = 0; i < length; i++) {
        const tmpResult = await Promise.all(tmp[i]);
        result = result.concat(tmpResult);
    }
    return result;
}
exports.parallelLimit = parallelLimit;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
/**
 *
 * @param promises
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
 * @param promises
 */
function series(promises) {
    let result = Promise.resolve();
    for (const p of promises) {
        result = result.then(() => p);
    }
    return result;
}
exports.series = series;
/**
 *
 * @param promises
 * @param args
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
 * @param time
 * @param timeoutWrap
 */
function wait(time, timeoutWrap = { timeout: 0 }) {
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
 * @param promises
 */
function props(promises) {
    const keys = Object.keys(promises);
    const list = keys.map(key => promises[key]);
    return Promise.all(list).then(lib_1.arrayToMapFunc(keys));
}
exports.props = props;
const mute = () => {
    /**/
};
/**
 *
 * @param p
 * @param cb
 */
function silence(p, cb = mute) {
    if (Array.isArray(p)) {
        return p.map(promise => promise.catch(cb));
    }
    return [];
}
exports.silence = silence;
/**
 *
 * @param pFunc
 * @param times
 */
function retry(pFunc, times = 500) {
    let p = pFunc();
    for (let i = 1; i < times; i++) {
        p = p.catch(pFunc);
    }
    return p;
}
exports.retry = retry;
/**
 *
 * @param pFunc
 * @param times
 * @param time
 * @param timeout
 */
async function retryWithPause(pFunc, times = 200, time = 100, timeout) {
    let p = pFunc();
    for (let i = 1; i < times; i++) {
        p = p.catch(() => wait(time, timeout)).then(pFunc);
    }
    return p;
}
exports.retryWithPause = retryWithPause;
/**
 *
 * @param pFunc
 * @param times
 */
async function repeat(pFunc, times = 200) {
    let i = 0;
    const result = [];
    while (i++ < times) {
        const promiseResult = await pFunc();
        result.push(promiseResult);
    }
    return result;
}
exports.repeat = repeat;
/**
 *
 * @param pFunc
 * @param times
 * @param time
 * @param timeout
 */
async function repeatWithPause(pFunc, times = 200, time = 100, timeout) {
    let i = 0;
    const result = [];
    while (i++ < times) {
        await wait(time, timeout);
        const promiseResult = await pFunc();
        result.push(promiseResult);
    }
    return result;
}
exports.repeatWithPause = repeatWithPause;
/**
 *
 * @param p
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
 * @param p
 * @param limit
 */
async function parallelLimit(p, limit) {
    let result = [];
    const list = p instanceof Array ? p : [...p];
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
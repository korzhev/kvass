"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param {string[]} keys
 * @returns {(results) => {}}
 */
function arrayToMap(keys) {
    return results => {
        return results.reduce((acc, result, i) => {
            acc[keys[i]] = result;
            return acc;
        }, {});
    };
}
exports.arrayToMap = arrayToMap;
/**
 *
 * @param {any[]} array
 * @param {number} chunkSize
 * @returns {any[]}
 */
function split(array, chunkSize) {
    if (chunkSize <= 0) {
        throw Error(`chunkSize(${chunkSize}) parameter should be > 0`);
    }
    return [].concat.apply([], array.map((elem, i) => {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    }));
}
exports.split = split;
//# sourceMappingURL=index.js.map
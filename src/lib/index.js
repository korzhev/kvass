"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param keys
 */
function arrayToMapFunc(keys) {
    return (results) => {
        return results.reduce((acc, result, i) => {
            acc[keys[i]] = result;
            return acc;
        }, {});
    };
}
exports.arrayToMapFunc = arrayToMapFunc;
/**
 *
 * @param array
 * @param chunkSize
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
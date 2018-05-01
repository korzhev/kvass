"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai"); // tslint:disable-line
const kvass = require("../src");
chai_1.should();
describe('Promise flow helper', () => {
    it('should waterfall', () => {
        const promises = [
            () => Promise.resolve(1),
            (i) => Promise.resolve(i + 1),
            (i) => Promise.resolve(i + 1),
        ];
        const promiseSet = new Set(promises);
        return Promise.all([
            kvass.waterfall(promises).then(value => value.should.be.equal(3)),
            kvass.waterfall(promiseSet).then(value => value.should.be.equal(3)),
        ]);
    });
    it('should tap', () => {
        return Promise.resolve(1)
            .then(kvass.tap(i => Promise.resolve(i + 1)))
            .then(value => value.should.be.equal(1));
    });
    it('should series', () => {
        const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        const promiseSet = new Set(promises);
        return Promise.all([
            kvass.series(promises).then(value => value.should.be.equal(3)),
            kvass.series(promiseSet).then(value => value.should.be.equal(3)),
        ]);
    });
    it('should seriesApply', () => {
        const args = [1, 2, 3];
        const promises = [
            (v) => Promise.resolve(v * 2),
            (v) => Promise.resolve(v * 2),
            (v) => Promise.resolve(v * 2),
        ];
        const promiseSet = new Set(promises);
        return Promise.all([
            kvass.seriesApply(promises, args).then(value => value.should.be.equal(6)),
            kvass.seriesApply(promiseSet, args).then(value => value.should.be.equal(6)),
        ]);
    });
    it('should seriesApply with not enough args', () => {
        const args = [1, 2];
        const promises = [
            (v) => Promise.resolve(v * 2),
            (v) => Promise.resolve(v * 2),
            (v) => Promise.resolve(v * 2),
        ];
        const promiseSet = new Set(promises);
        return Promise.all([
            kvass.seriesApply(promises, args).then(value => value.should.be.NaN),
            kvass.seriesApply(promiseSet, args).then(value => value.should.be.NaN),
        ]);
    });
    it('should wait', () => {
        return kvass.wait(100);
    });
    it('should wait and save timeout', () => {
        const timeoutWrap = { timeout: 0 };
        return kvass.wait(100, timeoutWrap).then(() => {
            timeoutWrap.timeout.should.haveOwnProperty('_called').which.equal(true);
        });
    });
    it('should props', () => {
        const obj = {
            a: Promise.resolve('a'),
            b: Promise.resolve('b'),
        };
        return kvass.props(obj).then(result => {
            result.should.be.deep.equal({ a: 'a', b: 'b' });
        });
    });
    it('should silence no callback', () => {
        const arr = kvass.silence([Promise.reject(new Error('zhopa'))]);
        return Promise.all(arr).then(([e]) => chai_1.should().not.exist(e));
    });
    it('should silence', () => {
        const arr = kvass.silence([Promise.reject(new Error('zhopa'))], () => 1);
        return Promise.all(arr).then(([e]) => e.should.be.equal(1));
    });
    it('should retry', () => {
        let counter = 0;
        const promiseFunc = () => new Promise((res, rej) => {
            if (++counter < 5) {
                rej(new Error('wait'));
            }
            res(1);
        });
        return kvass.retry(promiseFunc, 5).then(result => {
            result.should.be.equal(1);
            counter.should.be.equal(5);
        });
    });
    it('should retryWithPause', () => {
        let counter = 0;
        const promiseFunc = () => new Promise((res, rej) => {
            if (++counter < 5) {
                rej(new Error('wait'));
            }
            res(1);
        });
        return kvass.retryWithPause(promiseFunc, 5, 100).then(result => {
            result.should.be.equal(1);
            counter.should.be.equal(5);
        });
    });
    it('should repeat', () => {
        const counter = 0;
        const promiseFunc = () => Promise.resolve(1);
        return kvass.repeat(promiseFunc, 5).then(result => {
            result.should.be.deep.equal([1, 1, 1, 1, 1]);
        });
    });
    it('should repeatWithPause', () => {
        const counter = 0;
        const promiseFunc = () => Promise.resolve(1);
        return kvass.repeatWithPause(promiseFunc, 5, 100).then(result => {
            result.should.be.deep.equal([1, 1, 1, 1, 1]);
        });
    });
    it('should mapSeries', () => {
        const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        const promiseSet = new Set(promises);
        return Promise.all([
            kvass.mapSeries(promises).then(value => value.should.be.deep.equal([1, 2, 3])),
            kvass.mapSeries(promiseSet).then(value => value.should.be.deep.equal([1, 2, 3])),
        ]);
    });
    it('should parallelLimit', () => {
        const promises = [
            Promise.resolve(1),
            Promise.resolve(2),
            Promise.resolve(3),
            Promise.resolve(4),
            Promise.resolve(5),
        ];
        const promiseSet = new Set(promises);
        return Promise.all([
            kvass.parallelLimit(promises, 2).then(value => value.should.be.deep.equal([1, 2, 3, 4, 5])),
            kvass.parallelLimit(promiseSet, 2).then(value => value.should.be.deep.equal([1, 2, 3, 4, 5])),
        ]);
    });
});
//# sourceMappingURL=index.js.map
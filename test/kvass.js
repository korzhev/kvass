const should = require("should"); // eslint-disable-line
const kvass = require('../lib');

const p = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];

describe('kvass', () => {
  describe('.reflect()', () => {
    it('promise', done => {
      kvass.reflect(p[0]).then(() => done()).catch(done);
    });
  });
});

const BEER = '🍺';
const BEERS = '🍻';

/**
 *
 * @param array
 * @param chunkSize
 * @returns {*}
 */
function split (array, chunkSize) {
  return [].concat.apply(
    [],
    array.map(function (elem, i) {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  );
}
/**
 *
 * @param time
 * @returns {Promise}
 */
function pause (time) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

/**
 *
 * @param p
 * @returns {Promise|Promise.<T>|*}
 */
function reflect (p) {
  return Array.isArray(p)
    ? p.map(promise => promise.catch(e => e))
    : p.catch(e => e);
}

/**
 *
 * @param p
 * @returns {Promise|Promise.<T>|*}
 */
function silence (p) {
  return p.catch(() => {});
}

/**
 *
 * @param list
 * @returns {Promise.<*>}
 */
function parallel (list) {
  return Promise.all(list);
}

/**
 *
 * @param list
 * @param args
 * @returns {*}
 */
function seriesApply (list, args) {
  return list.reduce((p, item, i) => {
    return p.then(item(args[i]));
  }, Promise.resolve());
}

/**
 *
 * @param list
 * @returns {Promise.<*>}
 */
function waterfall (list) {
  return list.reduce((p, item) => {
    return p.then(item);
  }, Promise.resolve());
}

/**
 *
 * @param list
 * @returns {Promise.<*>}
 */
function race (list) {
  return Promise.race(list);
}

/**
 *
 * @param p
 * @param times
 * @returns {Promise.<*>}
 */
async function retry (p, times = Infinity) {
  let i = 1;
  let err = null;
  let result = null;
  while (i++ < times && !result) {
    try {
      result = await p;
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
  return result;
}

/**
 *
 * @param p
 * @param time
 * @param times
 * @returns {Promise.<*>}
 */
async function retryWithPause (p, time = 100, times = Infinity) {
  let i = 1;
  let err = null;
  let result = null;
  while (i++ < times && !result) {
    try {
      await pause(time);
      result = await p;
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
  return result;
}

/**
 *
 * @param p
 * @param time
 * @param times
 * @returns {Promise.<Array>}
 */
async function repeatWithPause (p, time = 100, times = Infinity) {
  let i = 1;
  const result = [];
  while (i++ < times) {
    await pause(time);
    const promiseResult = await p;
    result.push(promiseResult);
  }
  return result;
}

/**
 *
 * @param p
 * @param times
 * @returns {Promise.<Array>}
 */
async function repeat (p, times = Infinity) {
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
 * @param list
 * @returns {Promise.<Array>}
 */
async function mapSeries (list) {
  const result = [];
  const length = list.length;
  for (let i = 0; i < length; i++) {
    const promiseResult = await list[i];
    result.push(promiseResult);
  }
  return result;
}

/**
 *
 * @param list
 * @param limit
 * @returns {Promise.<Array>}
 */
async function parallelLimit (list, limit) {
  let result = [];

  const tmp = split(list, Math.ceil(list.length / limit));
  const length = tmp.length;
  for (let i = 0; i < length; i++) {
    const tmpResult = await Promise.all(tmp[i]);
    result = result.concat(tmpResult);
  }
  return result;
}

module.exports = {
  parallel,
  parallelLimit,
  seriesApply,
  series: waterfall,
  mapSeries,
  waterfall,
  race,
  retry,
  retryWithPause,
  repeat,
  repeatWithPause,
  reflect,
  silence,
  [BEER]: this,
  [BEERS]: this
};

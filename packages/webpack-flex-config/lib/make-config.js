const Helper = require('./config-helpers/Helper');

function traverse(obj, fn) {
  const type = Object.prototype.toString.call(obj);

  if (type === '[object Object]') {
    let result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        const newElement = fn(element, key);
        result[key] = traverse(newElement, fn);
      }
    }
    return result;
  } else if (type === '[object Array]') {
    return obj.map(fn);
  } else {
    return fn(obj);
  }
}

/**
 *  take a flex config, output a webpack config
 * @param {object} flexConfig
 */
function makeConfig(flexConfig) {
  return traverse(flexConfig, obj => {
    return obj instanceof Helper ? obj.output() : obj;
  });
}

module.exports = makeConfig;

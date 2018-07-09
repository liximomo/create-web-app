// 合并俩个 flex-webpack 配置
const mergeWith = require('lodash.mergewith');
const utils = require('./utils');
const Helper = require('./config-helpers/Helper');
const Slot = require('./config-helpers/Slot');

function isHelper(any) {
  return any instanceof Helper;
}

function findTicketIndex(list, key) {
  return list.findIndex(value => value.key === key);
}

/**
 * 合并两个含有 slot 的 List
 */
function mergeSlot(objSlotList, srcSlotList) {
  let srcHasSlot = false;
  let indexCacheMap = new Map();
  const result = objSlotList;
  const newSlots = [];

  // cache index
  objSlotList.forEach((s, index) => {
    if (s instanceof Slot) {
      indexCacheMap.set(s.getId(), index);
    }
  });

  // merge same slot
  srcSlotList.forEach(s => {
    if (!(s instanceof Slot)) return;

    srcHasSlot = true;
    const id = s.getId();
    if (indexCacheMap.has(id)) {
      // overwrite by key
      const srcSlot = result[indexCacheMap.get(id)];
      srcSlot.merge(s, merge);
    } else {
      newSlots.push(s);
    }
  });

  if (!srcHasSlot) {
    return srcSlotList.slice();
  }

  // insert new slot
  newSlots.forEach(s => s.insertTo(result));

  return result;
}

function mergeStrategy(objValue, srcValue) {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return mergeSlot(objValue, srcValue);
  }

  if (isHelper(objValue) && isHelper(srcValue)) {
    return objValue.merge(srcValue, merge);
  } else if (!isHelper(objValue) || !isHelper(srcValue)) {
    return srcValue;
  }
}

function baseMergeDeep(object, source, customizer) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const srcValue = source[key];
      if (utils.isObject(srcValue)) {
      }
    }
  }

  baseFor(
    source,
    function(srcValue, key) {
      if (isObject(srcValue)) {
        stack || (stack = new Stack());
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer
          ? customizer(safeGet(object, key), srcValue, key + '', object, source, stack)
          : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    },
    keysIn
  );
}

function baseMergeDeep(object, source, customizer) {
  if (source === null || typeof source === 'undefined') {
    return object;
  }

  if (object === source) {
    return object;
  }

  // customizer only for objects
  const newValue = customizer ? customizer(object, source) : undefined;

  if (newValue !== undefined) {
    return newValue;
  }

  /* eslint-disable no-param-reassign */
  Object.keys(source).forEach(key => {
    const srcValue = object[key];
    const objValye = source[key];
    if (utils.isObject(srcValue) && utils.isObject(objValye)) {
      object[key] = baseMergeDeep(srcValue, objValye, customizer);
    } else if (utils.isObject(objValye)) {
      object[key] = baseMergeDeep({}, objValye, customizer);
    } else {
      object[key] = objValye;
    }
  });
  /* eslint-enable */
  return object;
}

function merge() {
  const argArr = Array.prototype.slice.call(arguments);
  return argArr.reduce((obj, src) => baseMergeDeep(obj, src, mergeStrategy));
}

/**
 *
 * @param {object} source
 * @param {object[]} sources
 * @returns {object} extended conifg
 */
function mergeConfig() {
  const argArr = Array.prototype.slice.call(arguments);
  return merge.apply(undefined, argArr);
}

module.exports = mergeConfig;

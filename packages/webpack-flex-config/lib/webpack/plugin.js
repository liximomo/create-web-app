/**
 *  根据 `output` 产生 webpack 插件实例
 */

const Slot = require('../config-helpers/Slot');
const Inst = require('../config-helpers/Inst');
const parseKey = require('../helpers/parseKey');

class Plugin extends Slot {
  output() {
    const rule = { ...this._data };

    if (typeof rule.test === 'undefined') {
      rule.test = new RegExp(`\\.${this._id}$`);
    }

    if (rule.noTest === true) {
      delete rule.test;
      delete rule.noTest;
    }

    return rule;
  }

  constructor(id, data) {
    super(id);
  }
}

/**
 * id format: 'module/submodule$name'
 *
 * @param {string} id
 * @param {any} data
 * @param {any} option
 * @returns
 */
function createPlugin(id, data, option) {
  const instConfig = { ...data };
  if (instConfig.constructor == null) {
    const { name } = parseKey(id);
    instConfig.constructor = name;
  }

  return new Slot(id, new Inst(instConfig), option);
}

module.exports = createPlugin;

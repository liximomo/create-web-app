/**
 *  自动实例化对象
 */

const kebabCase = require('lodash.kebabcase');
const Helper = require('./Helper');

function tryRequire(name) {
  try {
    return require(name);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return null;
    }

    throw err;
  }
}

function resolveModule(name) {
  const kebabCasedModuleName = kebabCase(name);
  let requiredModule = tryRequire(kebabCasedModuleName);

  if (requiredModule) return requiredModule;

  requiredModule = tryRequire(name);

  if (requiredModule) return requiredModule;

  throw new Error(`Can't find module "${name}".`);
}

/**
 * data: {
 *  constructor: string | function
 *  option: any
 *  options: any[]
 * }
 */
class Inst extends Helper {
  constructor(config = {}) {
    super();
    this._config = config;
  }

  output() {
    const { constructor, option, options } = this._config;

    let constructorFunc;
    if (typeof constructor === 'string' || constructor instanceof String) {
      const [moduleName, ...subModules] = constructor.split('/');
      const requiredModule = resolveModule(moduleName);

      try {
        constructorFunc = subModules.reduce((m, sub) => m[sub], requiredModule);
      } catch (error) {
        throw new Error(`"${moduleName}.${subModules.join('.')}" not found. (${id})`);
      }

      if (constructorFunc === undefined) {
        throw new Error(`"${moduleName}.${subModules.join('.')}" not found. (${id})`);
      }
    } else {
      constructorFunc = constructor;
    }

    let instance;
    if (options !== undefined) {
      if (!Array.isArray(options)) {
        throw new Error(`plugins.${ticket.key}'s options property should be an array`);
      }

      options.unshift(undefined);
      instance = new (Function.prototype.bind.apply(constructorFunc, options))();
    } else if (option !== undefined) {
      // 显示区分 config.option 不为 undefied 的情况
      // 因为 new constructorFunc(undefined) 会造成 constructorFunc 函数内 arguments 为 [undefined]
      instance = new constructorFunc(option);
    } else {
      instance = new constructorFunc();
    }

    return instance;
  }

  merge(slot, mergeFunc) {
    this._config = mergeFunc(this._config, slot._config);
  }
}

module.exports = Inst;

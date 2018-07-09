const Helper = require('./Helper');

// 抽象类
class Transformer extends Helper {
  constructor(data) {
    super();
    this._data = data;
  }

  getData() {
    return this._data;
  }

  setData(data) {
    this._data = data;
  }

  output() {
    return this._data;
  }
}

module.exports = Transformer;

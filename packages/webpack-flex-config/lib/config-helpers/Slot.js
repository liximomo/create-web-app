const Helper = require('./Helper');

function findSlotIndex(list, id) {
  return list.findIndex(item => item instanceof Slot && item.getId() === id);
}

class Slot extends Helper {
  constructor(id, data, option = {}) {
    super();
    this._id = id;
    this._data = data;
    this._option = option;
  }

  insertTo(list) {
    const slot = this;
    const {
      before,
      after,
      prepend,
    } = this._option;

    if (before) {
      const index = findSlotIndex(list, before);
      if (index !== -1) {
        list.splice(index, 0, slot);
      } else {
        console.warn(`Can\'t find slot ${before}, check your "before" value.`);
      }
    } else if (after) {
      const index = findSlotIndex(list, after);
      if (index !== -1) {
        const beforeIndex = index + 1;
        // after last elment
        if (beforeIndex === list.length) {
          list.push(slot);
        } else {
          list.splice(beforeIndex, 0, slot);
        }
      } else {
        console.warn(`Can\'t find slot ${after}, check your "after" value.`);
      }
    } else if (prepend) {
      list.unshift(slot);
    } else {
      list.push(slot);
    }
  }

  getId() {
    return this._id;
  }

  output() {
    return this._data;
  }

  merge(slot, mergeFunc) {
    this._data = mergeFunc(this._data, slot._data);
    this._option = mergeFunc(this._option, slot._option);
  }
}

module.exports = Slot;

const SlotHelper = require('./config-helpers/Slot');
const RuleHelper = require('./config-helpers/Rule');

const Slot = (id, value) => new SlotHelper(id, value);
const Rule = (id, value) => new RuleHelper(id, value);

module.exports = {
  Rule,
  Slot,
};

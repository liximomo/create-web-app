const adaptorManager = new Map();

function register(name, adaptor) {
  if (adaptorManager.has(name)) {
    console.warn(`${name} adaptor have been registered. It will be overided.`);
  }

  adaptorManager.set(name, adaptor);
}

function deregister(name) {
  adaptorManager.delete(name);
}

module.exports = {
  register,
  deregister,
};

const { execSync } = require('child_process');

let _hasYarn;

exports.hasYarn = function() {
  if (_hasYarn !== undefined) {
    return _hasYarn;
  }

  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    _hasYarn = true;
    return true;
  } catch (e) {
    _hasYarn = false;
    return false;
  }
};

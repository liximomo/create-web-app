const glob = require('glob');

function createGlobPattern(files, context) {
  const withPatterns = files.map(file => {
    let pattern = file.replace(/^\//, '');
    if (pattern.indexOf('**') === -1) {
      pattern = `**/${pattern}`;
    }

    if (pattern.indexOf('.') === -1) {
      // default extension
      pattern += '.js';
    }

    return pattern;
  });

  return withPatterns.length > 1
    ? `${context}/{${withPatterns.join(',')}}`
    : `${context}/${withPatterns}`;
}

module.exports = (file, context = process.cwd()) => {
  const pattern = createGlobPattern([].concat(file), context);
  return glob.sync(pattern);
};

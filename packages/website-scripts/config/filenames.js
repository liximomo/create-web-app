const path = require('path');
const paths = require('./paths');

function getBundleName(entryFile) {
  const basename = path.basename(entryFile);
  return basename.split('.')[0];
}

function getHtmlTemplatePath(entryFile) {
  if (paths.appIndexJs === entryFile) {
    return paths.appHtml;
  }

  const dir = path.dirname(entryFile);
  return path.join(dir, 'index.html');
}

module.exports = {
  getBundleName,
  getHtmlTemplatePath,
};

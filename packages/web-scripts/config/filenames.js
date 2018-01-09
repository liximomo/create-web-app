const path = require('path');
const paths = require('../config/paths');

function getJsFileName(entryFile) {
  const basename = path.basename(entryFile);
  return basename.split('.')[0];
}

function getCssFilename(bundleName = 'style') {
  return `static/css/${bundleName}.[contenthash:8].css`;
}

function getHtmlTemplatePath(entryFile) {
  if (paths.appIndexJs === entryFile) {
    return paths.appHtml;
  }

  const dir = path.dirname(entryFile);
  return path.join(dir, 'index.html');
}

module.exports = {
  getJsFileName,
  getCssFilename,
  getHtmlTemplatePath,
};

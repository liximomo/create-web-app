const path = require('path');
const paths = require('./paths');

const hashFileName = process.env.HASH_FILENAME === 'false';

function getBundleName(entryFile) {
  const basename = path.basename(entryFile);
  return basename.split('.')[0];
}

function getJsFileName(entryFile) {
  const bundleName = getBundleName(entryFile);
  return hashFileName ? `static/js/${bundleName}.[chunkhash:8].js` : `static/js/${bundleName}.js`;
}

function getCssFilename(entryFile) {
  const bundleName = getBundleName(entryFile);
  // vscode syntax error with template string
  return hashFileName ? `static/css/${bundleName}.[contenthash:8].css` : `static/css/${bundleName}.css`;
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

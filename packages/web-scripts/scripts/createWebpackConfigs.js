const glob = require('glob');
const path = require('path');
const fs = require('fs');

const paths = require('../config/paths');
const filenames = require('../config/filenames');
const merge = require('webpack-merge');

const defaultOption = {
  multi: false,
  configPath: 'webpack.config.js',
};

function isFileExist(filepath) {
  let isExist = true;
  try {
    // Query the entry
    fs.lstatSync(filepath);
  } catch (e) {
    isExist = false;
  }
  return isExist;
}

function getEntryFiles(globPattern) {
  const entryFiles = glob.sync(globPattern);
  return entryFiles;
}

function getCustomConfigPath(entryFile) {
  return path.resolve(entryFile, '../app.config.js');
}

function getConfig(entryFile, filepath) {
  let config = require(filepath);
  if (typeof config === 'function') {
    config = config(entryFile, {
      env: process.env,
    });
  }
  return config;
}

function composeConfig(entryFile, option) {
  const baseConfig = getConfig(entryFile, option.configPath)

  const customConfigPath = getCustomConfigPath(entryFile);
  let customConfig;
  if (isFileExist(customConfigPath)) {
    customConfig = getConfig(entryFile, customConfigPath);
  }

  return customConfig ? merge(baseConfig, customConfig) : baseConfig;
}


// 为每个进入点配置一个 webpakc 实例
function createConfig(entryFile, option) {
  return composeConfig(entryFile, option);
}

function createGlobPattern(files, base = '') {
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
    ? `${base}/{${withPatterns.join(',')}}`
    : `${base}/${withPatterns}`;
}

function createWebpackConfigs(files = '*', option = {}) {
  const widthDefault = Object.assign({}, defaultOption, option);
  const pattern = createGlobPattern([].concat(files), paths.appSrc);
  const entryFiles = getEntryFiles(pattern);
  if (option.multi) {
    return entryFiles.map(entryFile => createConfig(entryFile, widthDefault));
  }
  return createConfig(entryFiles[0], widthDefault);
}

module.exports = createWebpackConfigs;

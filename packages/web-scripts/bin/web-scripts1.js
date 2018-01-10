#!/usr/bin/env node

const yargs = require('yargs');
const path = require('path');
const paths = require('../config/paths');
const packageInfo = require('../package.json');
const createWebpackConfigs = require('../scripts/createWebpackConfigs');

const isDev = process.env.NODE_ENV === 'development';

const baseWebpackConfigPath = isDev
  ? path.resolve(__dirname, '../config/webpack.config.dev.js')
  : path.resolve(__dirname, '../config/webpack.config.prod.js');

yargs.command(
  'start',
  'start development',
  yargs =>
    yargs
      .usage('Usage: $0 file')
      .help(),
  argv => {
    const start = require('../scripts/start');
    const files = argv._.slice(1);
    let file;
    if (files.length < 0) {
      file = paths.appIndexJs;
    } else {
      file = files[0];
    }
    start(createWebpackConfigs(file, { configPath: baseWebpackConfigPath }));
  }
);

const args = yargs
  .version(packageInfo.version)
  .usage('Usage: web-scripts <commamd>')
  .help().argv;

if (args._.length <= 0) {
  yargs.showHelp();
  // console.error(`${packageInfo.name}: require url be provided`);
  process.exit(0);
}

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const createWebpackConfigs = require('./utils/createWebpackConfigs');
const paths = require('./utils/paths');
const filenames = require('./utils/finenames');
const fileResolver = require('./utils/fileResolver');
const packageInfo = require('../package.json');
const webpackConfigPath = paths.scriptVersion + '/config/webpack.config.prod';

// load original configs
const webpackConfig = require(webpackConfigPath);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let file;
const args = process.argv.slice(2);

if (args.length < 1) {
  // forward to react-scripts
  file = paths.appIndexJs;
} else {
  file = fileResolver(args, paths.appSrc);
  if (file.length === 1) {
    file = file[0];
  }
}

function hackConfig(entryFile, config) {
  const entry = webpackConfig.entry.slice(0, webpackConfig.entry.length - 1);
  entry.push(entryFile);

  const output = Object.assign({}, webpackConfig.output, {
    filename: filenames.getJsFileName(entryFile),
  });

  const plugins = webpackConfig.plugins.map(plugin => {
    switch (plugin.constructor ? plugin.constructor.name : undefined) {
      case 'HtmlWebpackPlugin':
        const htmlTemplate = filenames.getHtmlTemplatePath(entryFile);
        return new HtmlWebpackPlugin({
          inject: true,
          template: htmlTemplate,
        });
      case 'ExtractTextPlugin':
        return new ExtractTextPlugin({
          filename: filenames.getCssFilename(entryFile),
        });
      default:
        break;
    }

    return plugin;
  });

  return createWebpackConfigs(entryFile, {
    config: Object.assign(webpackConfig, {
      output,
      entry,
      plugins,
    }),
  });
}

// override config in memory
require.cache[require.resolve(webpackConfigPath)].exports = Array.isArray(file)
  ? file.map(entry => hackConfig(entry, webpackConfig))
  : hackConfig(file, webpackConfig);

// run original script
require(paths.scriptVersion + '/scripts/build');

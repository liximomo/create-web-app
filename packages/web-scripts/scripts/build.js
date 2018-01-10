process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const createWebpackConfigs = require('./utils/createWebpackConfigs');
const paths = require('./utils/paths');
const filenames = require('./utils/finenames');
const fileResolver = require('./utils/fileResolver');
const packageInfo = require('../package.json');
const webpackConfigPath = paths.scriptVersion + '/config/webpack.config.dev';
const HtmlWebpackPluginPath = paths.scriptVersion + '/node_modules/html-webpack-plugin';

// load original configs
const webpackConfig = require(webpackConfigPath);
const HtmlWebpackPlugin = require(HtmlWebpackPluginPath);

let entryIndex;
const args = process.argv.slice(2);

if (args.length < 1) {
  // forward to react-scripts
  entryIndex = paths.appIndexJs;
} else {
  const file = args[0];
  const entryFiles = fileResolver(file, paths.appSrc);
  entryIndex = entryFiles[0];
}

const entry = webpackConfig.entry.slice(0, webpackConfig.entry.length - 1);
entry.push(entryIndex);

const plugins = webpackConfig.plugins.map(plugin => {
  if (plugin.constructor.name === 'HtmlWebpackPlugin') {
    const htmlTemplate = filenames.getHtmlTemplatePath(entryIndex);

    return new HtmlWebpackPlugin({
      inject: true,
      template: htmlTemplate,
    });
  }

  return plugin;
});

// override config in memory
require.cache[require.resolve(webpackConfigPath)].exports = Object.assign(webpackConfig, {
  entry,
  plugins,
});

require.cache[require.resolve(webpackConfigPath)].exports = createWebpackConfigs(entryIndex, {
  configPath: webpackConfigPath,
});

// run original script
require(paths.scriptVersion + '/scripts/start');

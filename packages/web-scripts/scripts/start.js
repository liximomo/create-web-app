process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const createWebpackConfigs = require('./utils/createWebpackConfigs');
const paths = require('./utils/paths');
const filenames = require('./utils/finenames');
const fileResolver = require('./utils/fileResolver');
const packageInfo = require('../package.json');
const webpackConfigPath = paths.scriptVersion + '/config/webpack.config.dev';

// load original configs
const webpackConfig = require(webpackConfigPath);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

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
  switch (plugin.constructor ? plugin.constructor.name : undefined) {
    case 'HtmlWebpackPlugin':
      const htmlTemplate = filenames.getHtmlTemplatePath(entryIndex);
      return new HtmlWebpackPlugin({
        inject: true,
        template: htmlTemplate,
        alwaysWriteToDisk: true
      });
    default:
      break;
  }

  return plugin;
});
plugins.push(new HtmlWebpackHarddiskPlugin());


// override config in memory
require.cache[require.resolve(webpackConfigPath)].exports = createWebpackConfigs(entryIndex, {
  config: Object.assign({}, webpackConfig, {
    entry,
    plugins,
  }),
});

// run original script
require(paths.scriptVersion + '/scripts/start');

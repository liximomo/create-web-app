process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const dotProp = require('dot-prop-immutable');
const createWebpackConfigs = require('./utils/createWebpackConfigs');
const paths = require('./utils/paths');
const filenames = require('./utils/finenames');
const fileResolver = require('./utils/fileResolver');
const packageInfo = require('../package.json');
const webpackConfigPath = paths.scriptVersion + '/config/webpack.config.dev';

// load original configs
const webpackConfig = require(webpackConfigPath);
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

const htmlTemplate = filenames.getHtmlTemplatePath(entryIndex);

const hackEntry = dotProp.set(webpackConfig, 'entry', entry => {
  const stripOriginIndexJs = entry.slice(0, entry.length - 1);
  stripOriginIndexJs.push(entryIndex);
  stripOriginIndexJs.push(htmlTemplate);
  return stripOriginIndexJs;
});

const hackLoader = dotProp.set(hackEntry, 'module.rules.1.oneOf', loaders => {
  const preLoaders = loaders.slice(0, loaders.length - 1);
  preLoaders.push({
    test: /\.(html)$/,
    use: {
      loader: require.resolve('html-loader'),
      options: {
        attrs: ['img:src'],
        minimize: false,
      },
    },
  });

  preLoaders.push(loaders.pop());
  return preLoaders;
});

const hackPlugins = dotProp.set(hackLoader, 'plugins', plugins => {
  return plugins.map(plugin => {
    switch (plugin.constructor ? plugin.constructor.name : undefined) {
      case 'HtmlWebpackPlugin':
        return new HtmlWebpackPlugin({
          inject: true,
          template: htmlTemplate,
        });
      default:
        break;
    }
  
    return plugin;
  });
});

// override config in memory
require.cache[require.resolve(webpackConfigPath)].exports = createWebpackConfigs(entryIndex, {
  config: hackPlugins,
});

// run original script
require(paths.scriptVersion + '/scripts/start');

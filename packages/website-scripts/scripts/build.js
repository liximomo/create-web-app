process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const dotProp = require('dot-prop-immutable');
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
  if (!file.length > 0) {
    console.log("can't resolve to a file from " + args);
    process.exit(-1);
  }
  // current only support build one file per run
  file = file[0];
}

function hackConfig(entryFile, config) {
  const htmlTemplate = filenames.getHtmlTemplatePath(entryFile);

  const hackEntry = dotProp.set(webpackConfig, 'entry', entry => {
    const stripOriginIndexJs = entry.slice(0, entry.length - 1);
    stripOriginIndexJs.push(entryFile);
    stripOriginIndexJs.push(htmlTemplate);
    return stripOriginIndexJs;
  });

  const hackOutput = dotProp.set(hackEntry, 'output', output => {
    return dotProp.set(output, 'filename', filenames.getJsFileName(entryFile));
  });

  const hackLoader = dotProp.set(hackOutput, 'module.rules.1.oneOf', loaders => {
    const preLoaders = loaders.slice(0, loaders.length - 1);
    preLoaders.push({
      test: /\.(html)$/,
      use: {
        loader: require.resolve('html-loader'),
        options: {
          interpolate: 'require',
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
        case 'ExtractTextPlugin':
          return new ExtractTextPlugin({
            filename: filenames.getCssFilename(entryFile),
          });
        default:
          break;
      }
  
      return plugin;
    });
  });

  return createWebpackConfigs(entryFile, {
    config: hackPlugins,
  });
}

// override config in memory
require.cache[require.resolve(webpackConfigPath)].exports = Array.isArray(file)
  ? file.map(entry => hackConfig(entry, webpackConfig))
  : hackConfig(file, webpackConfig);

// run original script
require(paths.scriptVersion + '/scripts/build');

const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const { uglify } = require('rollup-plugin-uglify');

module.exports = function createRollupConfig(opts, env) {
  const { filename, libName, format = ['umd'], sourcemap } = opts;

  const isEnvProduction = process.env.NODE_ENV === 'production';

  const plugins = [
    replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
    resolve(), // so Rollup can resolve node_modules
    commonjs({
      include: /node_modules/,
    }), // so Rollup can convert commonjs to an ES module
    babel({
      exclude: ['node_modules/**'],
      runtimeHelpers: true,
      presets: [
        [
          // Latest stable ECMAScript features
          '@babel/preset-env',
          {
            // We want Create React App to be IE 9 compatible until React itself
            // no longer works with IE 9
            targets: {
              ie: 9,
            },
            // Users cannot override this behavior because this Babel
            // configuration is highly tuned for ES5 support
            ignoreBrowserslistConfig: true,
            // If users import all core-js they're probably not concerned with
            // bundle size. We shouldn't rely on magic to try and shrink it.
            useBuiltIns: false,
            // Do not transform modules to CJS
            modules: false,
            // Exclude transforms that make all code slower
            exclude: ['transform-typeof-symbol'],
          },
        ],
        [
          '@babel/preset-react',
          {
            development: !isEnvProduction,
            // Will use the native built-in instead of trying to polyfill
            // behavior for any plugins that require one.
            useBuiltIns: true,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-proposal-class-properties',
          {
            loose: true,
          },
        ],
        // The following two plugins use Object.assign directly, instead of Babel's
        // extends helper. Note that this assumes `Object.assign` is available.
        // { ...todo, completed: true }
        [
          '@babel/plugin-proposal-object-rest-spread',
          {
            useBuiltIns: true,
          },
        ],
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false,
            helpers: false,
            regenerator: true,
            // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
            // We should turn this on once the lowest version of Node LTS
            // supports ES Modules.
            useESModules: true,
          },
        ],
        isEnvProduction && [
          // Remove PropTypes from production build
          'babel-plugin-transform-react-remove-prop-types',
          {
            removeImport: true,
          },
        ],
      ].filter(Boolean),
    }),
    isEnvProduction &&
      uglify({
        compress: {
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebookincubator/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
        },
        output: {
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebookincubator/create-react-app/issues/2488
          ascii_only: true,
        },
      }),
  ];

  return {
    output: [
      {
        file: filename,
        format: 'umd',
        name: libName,
        sourcemap,
      },
      {
        file: filename,
        format: 'cjs',
        sourcemap,
      },
      { file: filename, format: 'es', sourcemap },
    ].filter(output => format.indexOf(output.format) >= 0),
    plugins,
    onwarn(warning, warn) {
      console.log(1);
    },
  };
};

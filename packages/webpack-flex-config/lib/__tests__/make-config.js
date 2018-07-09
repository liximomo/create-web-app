const makeConfig = require('../make-config');
const Rule = require('../webpack/Rule');
// const Slot = require('../config-helper/Slot');

describe('make config', () => {
  test('Rule should convert to webpack rule config', () => {
    const rules = [
      new Rule('pre', { parser: { requireEnsure: true }, noTest: true }),
      new Rule('js', {
        test: /\.(js|jsx|mjs)$/,
        include: './src',
        use: [
          {
            loader: 'babel-loader',
            options: {
              // @remove-on-eject-begin
              babelrc: false,
              presets: ['babel-preset-react-app'],
              // @remove-on-eject-end
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: false,
            },
          },
        ],
      }),
      new Rule('css', { test: /\.css$/, use: ['style-loader'] }),
    ];

    expect(makeConfig(rules)).toEqual([
      { parser: { requireEnsure: true } },
      {
        test: /\.(js|jsx|mjs)$/,
        include: './src',
        use: [
          {
            loader: 'babel-loader',
            options: {
              // @remove-on-eject-begin
              babelrc: false,
              presets: ['babel-preset-react-app'],
              // @remove-on-eject-end
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: false,
            },
          },
        ],
      },
      { test: new RegExp('\\.css$'), use: ['style-loader'] },
    ]);
  });
});

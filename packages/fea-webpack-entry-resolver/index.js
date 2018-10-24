const resolver = require('./lib/resolver');

/**
 *
 *
 * @param {{_: string[], [x: string]: any }} argv
 */
module.exports = function(argv, ctx) {
  if (argv._.length <= 0) {
    return null;
  }

  return resolver(
    argv._,
    {
      indexFile: argv.entryIndex || 'index.js',
      scope: 'pages'
    },
    ctx
  );
};

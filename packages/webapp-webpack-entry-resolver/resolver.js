const path = require('path');
const fglob = require('fast-glob');

function makeEntryConfig(filepath, options) {
  const dir = path.dirname(filePath);
  const name = dir;
  const basename = path.basename(filePath);
  const htmlTemplatePath = path.join(dir, 'index.html');
  const htmlOuputPath = options.dev ? path.join(name, 'index.html') : `${name}.html`;

  return {
    name,
    filepath: filePath,
    htmlTemplatePath,
    htmlOuputPath,
  };
}

module.exports = async function(argv, options, ctx) {
  if (argv.length <= 0) {
    argv = ['index.js'];
  }

  const base = options.base;
  const index = options.indexFile;
  const requiredFiles = argv.map(i => {
    let relativeFilename = i;
    if (i.startsWith(base)) {
      relativeFilename = path.relative(base, i);
    }

    const fallback = relativeFilename.endsWith(index)
      ? relativeFilename
      : path.join(relativeFilename, index);
    return {
      filename: i,
      fallback,
    };
  });

  const needFallback = [];
  const entryFiles = [];
  let resolvedFiles = await fglob(requiredFiles.map(file => `${base}/**/${file.filename})`));

  resolvedFiles.forEach(files => {
    if (files.length) {
      entryFiles.push.apply(entryFiles, files);
    } else {
      needFallback.push(file);
    }
  });

  if (needFallback.length <= 0) {
    return entryFiles.map(i => makeEntryConfig(base, i));
  }

  resolvedFiles = await fglob(needFallback.map(file => `${base}/**/${file.fallback})`));

  resolvedFiles.forEach(files => {
    if (files.length) {
      entryFiles.push.apply(entryFiles, files);
    } else {
      throw new Error(`Can't find entry for ${file.filename}`);
    }
  });

  return entryFiles.map(i => makeEntryConfig(base, i));
};

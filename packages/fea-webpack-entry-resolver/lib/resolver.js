const fs = require('fs');
const path = require('path');

function fileExist(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    // Check exception. If ENOENT - no such file or directory ok, file doesn't exist.
    // Otherwise something else went wrong, we don't have rights to access the file, ...
    if (error.code != 'ENOENT') {
      throw error;
    }

    return false;
  }
}

/**
 *
 *
 * @param {string} filePath
 * @param {{ pageBase: string; }} ctx
 * @returns
 */
function makeEntryConfig(filePath, ctx) {
  const entryConfig = {
    entryPath: filePath,
  };

  const pageBase = ctx.pageBase;
  const relativePath = path.relative(pageBase, filePath);
  const scope = path.dirname(relativePath).replace(path.sep, '~');
  const pageDir = path.dirname(relativePath);
  const dirname = path.basename(pageDir);
  const filename = path.basename(filePath).replace(/\..*$/g, '');
  const name = filename !== 'index' ? filename : dirname;
  // const outputName = dirname.replace(path.sep, '/');
  entryConfig.name = name;
  entryConfig.htmlTemplatePath = path.resolve(filePath, '../index.html');
  entryConfig.relativePath = relativePath;
  entryConfig.scope = scope;

  return entryConfig;
}

/**
 *
 *
 * @param {string[]} entryList
 * @param {{ indexFile: string; scope: string; }} options
 * @param {{ srcRoot: string; }} ctx
 * @returns
 */
function resolveEntry(entryList, options, ctx) {
  const srcRoot = ctx.srcRoot;
  const scopeDir = options.scope;
  const pageBase = `${srcRoot}/${scopeDir}`;
  const index = options.indexFile;
  const requiredFiles = entryList.map(entryPath => {
    let relativeFspath;

    if (path.isAbsolute(entryPath)) {
      if (!entryPath.startsWith(pageBase)) {
        throw new Error(`Entry Invalid. ${entryPath} is not under in ${pageBase}.`);
      }

      relativeFspath = path.relative(pageBase, entryPath);
    } else {
      relativeFspath = entryPath;
    }

    const fallback = relativeFspath.endsWith(index) ? null : path.join(relativeFspath, index);
    return {
      filename: relativeFspath,
      fallback,
    };
  });

  const entryFiles = [];
  requiredFiles.forEach(file => {
    const filepath = `${pageBase}/${file.filename}`;
    if (fileExist(filepath)) {
      entryFiles.push(filepath);
      return;
    }

    if (file.fallback !== null) {
      const fallbackFilepath = `${pageBase}/${file.fallback}`;
      if (fileExist(fallbackFilepath)) {
        entryFiles.push(fallbackFilepath);
        return;
      }
    }

    throw new Error(`Can't find entry for "${file.filename}". "${filepath}" not exist.`);
  });

  return entryFiles.map(i => makeEntryConfig(i, { pageBase }));
}

module.exports = resolveEntry;

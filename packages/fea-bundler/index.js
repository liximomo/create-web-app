const path = require('path');
const bundleJS = require('./lib/bundle-js');

const JS_EXTENSIONS = ['.js', 'jsx', '.mjs', '.vue'];
const CSS_EXTENSIONS = ['.css', '.scss'];
function bundle(input, opts) {
  const baseName = path.basename(input);
  const libName = baseName.replace(/\.(.+)$/, '');
  const filename = path.join(path.dirname(input), baseName.replace(/\.(.+)$/, '-bundle$&'));
  const isJsFile = JS_EXTENSIONS.some(ext => input.endsWith(ext));
  const isCssFile = CSS_EXTENSIONS.some(ext => input.endsWith(ext));
  const options = Object.assign({ filename, libName }, opts || {});
  if (isJsFile) {
    return bundleJS(input, options);
  } else if (isCssFile) {
  } else {
    throw new Error('Unsupport file type!');
  }
}

if (require.main === module) {
  const input = process.argv.slice(2)[0];
  bundle(path.resolve(process.cwd(), input));
}

module.exports = bundle;

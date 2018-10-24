class ChunkNamesPlugin {
  /**
   * Creates an instance of ChunkNamesPlugin.
   *
   * @type
   * @param {{ fileName: string; chunkFilename: string, [x: string]: { fileName: string; chunkFilename: string } }} [pluginOption={}]
   * @memberof ChunkNamesPlugin
   */
  constructor(pluginOption = {}) {
    this._pluginOption = pluginOption;
  }

  apply(compiler) {
    const options = this._pluginOption;
    compiler.hooks.compilation.tap('FeaChunkNamesPlugin', compilation => {
      compilation.chunkTemplate.hooks.renderManifest.intercept({
        register(tapInfo) {
          if (tapInfo.name === 'JavascriptModulesPlugin') {
            const originMethod = tapInfo.fn;
            tapInfo.fn = (result, options) => {
              let filenameTemplate;
              const chunk = options.chunk;
              const outputOptions = options.outputOptions;
              if (chunk.isOnlyInitial()) {
                // only sync entry chunk using filename
                filenameTemplate = outputOptions.filename;
              } else {
                filenameTemplate = outputOptions.chunkFilename;
              }
              chunk.filenameTemplate = filenameTemplate;
              return originMethod(result, options);
            };
          } else if (options[tapInfo.name]) {
            const outputOptions = options[tapInfo.name];
            const originMethod = tapInfo.fn;
            tapInfo.fn = (result, options) => {
              const chunk = options.chunk;
              const push = r => {
                if (chunk.isOnlyInitial()) {
                  // only sync entry chunk using filename
                  r.filenameTemplate = outputOptions.filename;
                } else {
                  r.filenameTemplate = outputOptions.chunkFilename;
                }
                result.push(r);
              };
              return originMethod({ push }, options);
            };
          }
          return tapInfo;
        },
      });
    });
  }

  rename(fn, filename) {
    return;
  }
}

module.exports = ChunkNamesPlugin;

const rollup = require('rollup');
const createRollupConfig = require('./createRollupConfig');

module.exports = async function bundleJS(input, options) {
  const { output, ...rest } = createRollupConfig(options, process.env.NODE_ENV);

  try {
    const bundle = await rollup.rollup({
      input,
      ...rest,
    });
    await Promise.all(output.map(o => bundle.write(o)));
  } catch (error) {
    console.log(error);
  }
};

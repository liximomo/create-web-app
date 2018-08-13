#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const packageJson = require('../package').version;

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        'You are using Node ' +
          process.version +
          ', but this version of ' +
          id +
          ' requires Node ' +
          wanted +
          '.\nPlease upgrade your Node version.'
      )
    );
    process.exit(1);
  }
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach(o => {
    const key = o.long.replace(/^--/, '');
    // if an option is not present or Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
}

checkNodeVersion(packageJson.engines.node, 'webapp-cli');

const program = require('commander');

program.version(packageJson.version).usage('<command> [options]');

program
  .command('create <app-name>')
  .description('create a new project')
  .option('-g, --git [message]', 'Force git initialization with initial commit message')
  .option('-n, --no-git', 'Skip git initialization')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    // --git makes commander to default git to true
    if (process.argv.includes('-g') || process.argv.includes('--git')) {
      options.forceGit = true;
    }
    require('../lib/scripts/create')(name, options);
  });


program
  .command('serve [entry...]')
  .description('serve a app in development mode')
  .action((name, cmd) => {
    require('../lib/scripts/serve')(name, cleanArgs(cmd));
  });

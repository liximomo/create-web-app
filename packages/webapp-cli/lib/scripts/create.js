const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const { hasYarn } = require('@webapp/dev-utils');
const validateProjectName = require('validate-npm-package-name');
const os = require('os');

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}

function createPackageJson(root, appName) {
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
  };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL);
}

function install(root, useYarn, dependencies) {
  return new Promise((resolve, reject) => {
    let command;
    let args;
    if (useYarn) {
      command = 'yarnpkg';
      args = ['add'];
      [].push.apply(args, dependencies);

      // Explicitly set cwd() to work around issues like
      // https://github.com/facebookincubator/create-react-app/issues/3326.
      // Unfortunately we can only do this for Yarn because npm support for
      // equivalent --prefix flag doesn't help with this issue.
      // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
      args.push('--cwd');
      args.push(root);
    } else {
      command = 'npm';
      args = ['install', '--save', '--loglevel', 'error'].concat(dependencies);
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

async function run(root, name, template, useYarn) {
  fs.ensureDirSync(name);
  console.log(`Creating a new web app in ${chalk.green(root)}.\n`);
  createPackageJson(root, name);

  const allDependencies = ['react', 'react-dom', 'vue', '@webapp/scripts'];
  console.log(
    `Installing ${chalk.cyan('react')}, ${chalk.cyan('react-dom')}, ${chalk.cyan(
      'vue'
    )}, and ${chalk.cyan('@webapp/scripts')}...\n`
  );

  try {
    await install(root, useYarn, allDependencies);
  } catch (reason) {
    console.log();
    console.log('Aborting installation.');
    if (reason.command) {
      console.log(`  ${chalk.cyan(reason.command)} has failed.`);
    } else {
      console.log(chalk.red('Unexpected error. Please report it as a bug:'));
      console.log(reason);
    }
    console.log();

    // On 'exit' we will delete these files from target directory.
    const knownGeneratedFiles = [
      'package.json',
      'npm-debug.log',
      'yarn-error.log',
      'yarn-debug.log',
      'node_modules',
    ];
    const currentFiles = fs.readdirSync(root);
    currentFiles.forEach(file => {
      knownGeneratedFiles.forEach(fileToMatch => {
        // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
        // and the rest of knownGeneratedFiles.
        if (
          (fileToMatch.match(/.log/g) && file.indexOf(fileToMatch) === 0) ||
          file === fileToMatch
        ) {
          console.log(`Deleting generated file... ${chalk.cyan(file)}`);
          fs.removeSync(path.join(root, file));
        }
      });
    });
    const remainingFiles = fs.readdirSync(root);
    if (!remainingFiles.length) {
      // Delete target folder if empty
      console.log(
        `Deleting ${chalk.cyan(`${name} /`)} from ${chalk.cyan(path.resolve(root, '..'))}`
      );
      fs.removeSync(root);
    }
    console.log('Done.');
    process.exit(1);
  }
}

async function create(name, options) {
  const cwd = options.cwd || process.cwd();
  const useYarn = options.useNpm ? false : hasYarn();
  const targetDir = path.resolve(cwd, name);
  const template = path.resolve(__dirname, '../generator');

  const result = validateProjectName(name);
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    );

    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }

  if (!fs.existsSync(targetDir)) {
    return await run(targetDir, name, template, useYarn);
  }

  if (options.force) {
    await fs.remove(targetDir);
  } else {
    const { overwrite } = await inquirer.prompt([
      {
        name: 'overwrite',
        type: 'confirm',
        message: `Target directory ${chalk.cyan(
          targetDir
        )} already exists. Will you want to overwrite it?`,
      },
    ]);

    if (!overwrite) {
      return;
    }

    console.log(`Removing ${chalk.cyan(targetDir)}...`);
    await fs.remove(targetDir);
  }

  await run(targetDir, name, template, useYarn);
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    console.error(chalk.bgRed(' ERROR '), chalk.red(msg));
  });
};

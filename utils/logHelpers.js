const chalk = require('chalk');

const info = (msg) => {
  console.info(chalk.bold.whiteBright(msg));
};

const warn = (msg) => {
  console.warn(chalk.inverse.yellow(` GAS-PLUGIN `) + chalk.yellow.bold(`\t${msg}`));
}

module.exports = { info, warn };
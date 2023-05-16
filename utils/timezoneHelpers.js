const inquirer = require('inquirer');
const ct = require('countries-and-timezones');

const defaultTimezone = 'Etc/GMT';

const regions = Object.keys(ct.getAllTimezones())
  .map(name => name.replace(/\/.+$/, ''))
  .filter((v, i, arr) => arr.indexOf(v) === i && v !== 'GMT' && v !== 'UTC')
  .map(name => ({
    name,
    value: name
  }));

const timezones = (region) => Object.keys(ct.getAllTimezones())
  .filter(name => name.indexOf(region) === 0)
  .map(name => ({
    name: name.replace(/^.+?\//, ''),
    value: name
  }));

const timezoneChanger = (defaultTimezone = defaultTimezone) => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'region',
      message: 'Select a region',
      validate: input => !!input,
      default: defaultTimezone.replace(/\/.+$/, ''),
      choices: regions,
      pageSize: 10
    },
    {
      type: 'list',
      name: 'timeZone',
      message: 'Select a timezone',
      validate: input => !!input,
      default: defaultTimezone,
      choices: answers => timezones(answers.region),
      pageSize: 10,
    }
  ]);
}

module.exports = {
  regions,
  timezones,
  timezoneChanger,
  defaultTimezone
}

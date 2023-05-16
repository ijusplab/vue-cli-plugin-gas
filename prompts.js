const licensesInformation = require('spdx-license-list/spdx-simple.json')
const locales = require('./utils/locales');
const { regions, timezones, defaultTimezone } = require('./utils/timezoneHelpers');

const licenses = licensesInformation.map(name => ({
  name,
  value: name
}));

const scriptTypes = ['standalone', 'docs', 'sheets', 'slides', 'forms', 'webapp', 'api'].map(name => ({
  name,
  value: name
}));

let defTimezone = 'Etc/GMT';

module.exports = [
  {
    type: 'list',
    name: 'locale',
    message: 'Select locale',
    choices: locales,
    default: 'pt-br',
    group: 'Locale'
  },
  {
    type: 'confirm',
    name: 'createScript',
    message: 'Create new script?',
    default: true,
    group: 'Clasp'
  },
  {
    type: 'input',
    name: 'scriptId',
    when: answer => !answer.createScript,
    message: 'Inform script Id:',
    validate: input => /^[\w-]{57}$/.test(input),
    group: 'Clasp'
  },
  {
    type: 'list',
    name: 'scriptType',
    when: answer => answer.createScript,
    message: 'Select script type',
    choices: scriptTypes,
    default: 'standalone',
    group: 'Clasp'
  },
  {
    type: 'list',
    name: 'region',
    when: answer => answer.createScript,
    message: 'Select a region',
    validate: input => !!input,
    default: defaultTimezone.replace(/\/.+$/, ''),
    choices: regions,
    pageSize: 10
  },
  {
    type: 'list',
    name: 'timeZone',
    when: answer => answer.createScript && answer.region,
    message: 'Select a timezone',
    validate: input => !!input,
    default: defaultTimezone,
    choices: answers => timezones(answers.region),
    pageSize: 10,
  },
  {
    type: 'confirm',
    name: 'addLicense',
    message: 'Add license?',
    default: false,
    group: 'License'
  },
  {
    type: 'list',
    name: 'licenseName',
    when: answer => answer.addLicense,
    message: 'Choose a license:',
    choices: licenses,
    default: 'MIT',
    group: 'License'
  },
  {
    type: 'input',
    name: 'copyrightHolders',
    when: answer => answer.addLicense,
    message: 'Enter copyright holders:',
    group: 'License'
  }
];

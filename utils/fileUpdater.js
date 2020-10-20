const path = require('path');
const { readFileSync } = require('fs');
const { info, warn } = require('./logHelpers');

const updaters = (api, options) => {

  const entryFile = (content) => {

    const usesTypescript = api.hasPlugin('typescript');
    const usesEslint = api.hasPlugin('eslint');

    const lines = content.split(/\r?\n/g);

    lines[0] = [
      `import google from '@ijusplab/vue-cli-plugin-gas/google.mock'`,
      `import VueGasPlugin from '@ijusplab/vue-cli-plugin-gas/utils/VueGasPlugin'`,
      lines[0]
    ].join('\n');

    if (usesTypescript && usesEslint) {
      lines[0] = [
        '/* eslint-disable  @typescript-eslint/ban-ts-ignore */',
        '',
        lines[0]
      ].join('\n');
    }

    if (usesTypescript && /vuetify,/.test(content)) {
      lineIndex = lines.findIndex(line => line.match(/vuetify,/));
      lines[lineIndex] = '\t//@ts-ignore\n' + lines[lineIndex];
    }

    lineIndex = lines.findIndex(line => line.match(/new Vue/));
    lines[lineIndex - 1] = [
      lines[lineIndex - 1],
      `Vue.use(VueGasPlugin, {`,
      `  google,`,
      `  devMode: process.env.NODE_ENV !== 'production'`,
      `})`,
      ''
    ].join('\n');

    return lines.join('\n');
  }

  const vueComponent = (content) => {

    const style = [
      '',
      '<style>',
      '    .dummy { margin: 0; }',
      '</style>'
    ].join('\n');

    return /<style.*?>[^]*?<\/style>/.test(content) ? content : content + style;
  }

  const envFile = (content) => {
    const { appName } = options;
    return [
      `VUE_APP_TITLE = ${appName}`,
      'VUE_APP_FAVICON = https://raw.githubusercontent.com/vuejs/vue-cli/eda048a0fce9bdd3ddb423d8c5f58e1448acc897/docs/.vuepress/public/icons/favicon-16x16.png'
    ].join('\n') + content;
  }

  const eslintrcFile = (content) => {

    const usesTypescript = api.hasPlugin('typescript');

    let config = {
      root: true,
      env: {
        'googleappsscript/googleappsscript': true
      },
      extends: [
        'plugin:vue/essential',
        'eslint:recommended'
      ],
      plugins: [
        'googleappsscript'
      ],
      parserOptions: {
        ecmaVersion: 2020
      },
      rules: {
        'no-console': 'off',
        'no-debugger': 'off'
      }
    };

    if (usesTypescript) {
      config.extends = [
        '@vue/typescript'
      ];
      config.plugins.push('@typescript-eslint');
      config.parserOptions.parser = '@typescript-eslint/parser';
    }

    return JSON.stringify(config, null, 4);
  };

  const eslintignoreFile = (content) => {
    return [
      '*.output.js',
      'vue.config.js'
    ].join('\n');
  };

  const licenseFile = (content) => {

    const replaceInLicense = (licenseTextTemplate, sourceText, newText) => {
      return licenseTextTemplate.replace(new RegExp(`<${sourceText}>`), newText)
        .replace(new RegExp(`\\[${sourceText}\\]`), newText)
    }

    const { copyrightHolders, licenseName } = options;
    const licenseList = require('spdx-license-list/full');
    const licenseTextTemplate = licenseList[licenseName].licenseText;
    const year = new Date().getFullYear();

    let licenseText = replaceInLicense(licenseTextTemplate, 'year', year);
    licenseText = replaceInLicense(licenseText, 'copyright holders', copyrightHolders);

    return licenseText;
  }

  const gitignoreFile = (content) => {

    const { appName } = options;

    return content + [
      '',
      '# Added by vue-cli-plugin-gas',
      '.env',
      '*.output.js'
    ].join('\n');
  }

  const indexFile = (content) => {

    const { locale } = options;

    content = content.replace(/lang="en"/, `lang="${locale}"`);
    content = content.replace(/<link rel="icon".+>/, `<link rel="icon" href="<%= process.env.VUE_APP_FAVICON %>">`);
    content = content.replace(/<%= htmlWebpackPlugin.options.title %>/g, '<%= process.env.VUE_APP_TITLE %>');

    return content;
  }

  const readme = (content) => {
    const { appName } = options;
    const text = readFileSync(path.resolve(__dirname, './README.template.MD'), { encode: 'utf8' }).toString();
    return text.replace(/\{\{\s*appName\s*\}\}/, appName);
  }

  const vuetifyPluginFile = (content) => {

    const { usesTypescript, usesEslint } = options;

    const lines = content.split(/\r?\n/g);

    if (usesTypescript) {
      if (usesEslint) {
        lines[0] = [
          '/* eslint-disable  @typescript-eslint/ban-ts-ignore */',
          '',
          lines[0]
        ].join('\n');
      }

      let lineIndex = lines.findIndex(line => line.match(/import Vuetify/));
      lines[lineIndex] = '//@ts-ignore\n' + lines[lineIndex];
    }

    return lines.join('\n');
  }

  const tsConfig = (content) => {

    const tsConfigObj = JSON.parse(content);
    if (!Array.isArray(tsConfigObj.exclude)) {
        tsConfigObj.exclude = []
    }
    tsConfigObj.exclude.push('src/server/**/*.ts');

    return JSON.stringify(tsConfigObj, null, 2);
  }

  return {
    entryFile,
    vueComponent,
    envFile,
    eslintrcFile,
    eslintignoreFile,
    licenseFile,
    gitignoreFile,
    indexFile,
    readme,
    vuetifyPluginFile,
    tsConfig
  }
};

const updateFile = (files, name, callback) => {
  let fileContent = files[name];
  if (!fileContent) {
    fileContent = '\n ';
    warn(`File not found ${name}. Had to create it.`);
  }
  files[name] = callback(fileContent);
};

class FileUpdater {
  constructor(api, options, files) {
    this.updaters = updaters(api, options);
    this.files = files;
  }
  delete(fileNames) {
    fileNames.forEach(file => {
      if (this.files[file]) delete this.files[file];
    });
  }
  update(items) {
    Object.keys(items).forEach(updater => {
      if (items[updater] && this.updaters[updater]) updateFile(this.files, items[updater], content => this.updaters[updater](content));
    });
  }
}

module.exports = FileUpdater
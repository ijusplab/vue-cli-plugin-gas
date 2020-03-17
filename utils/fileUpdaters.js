const entryFile = (content, api, options) => {

    const usesTypescript = api.hasPlugin('typescript');
    const usesEslint = api.hasPlugin('eslint');

    const lines = content.split(/\r?\n/g);

    if (usesTypescript && usesEslint) {
        lines[0] = [
            '/* eslint-disable  @typescript-eslint/ban-ts-ignore */',
            '/* eslint-disable  @typescript-eslint/no-explicit-any */',
            '',
            lines[0]
        ].join('\n');
    }

    let lineIndex = lines.findIndex(line => line.match(/Vue.config/));
    lines[lineIndex] += `\n\nconst DEVELOPMENT_MODE = process.env.VUE_APP_DEVELOPMENT_MODE === 'true';`;

    if (usesTypescript && /vuetify,/.test(content)) {
        lineIndex = lines.findIndex(line => line.match(/vuetify,/));
        lines[lineIndex] = '\t//@ts-ignore\n' + lines[lineIndex];
    }

    const type = usesTypescript ? ': any' : '';
    const comment = usesTypescript ? '// @ts-ignore' : '';
    const code = [
        '',
        `Vue.prototype.$log = (payload${type}) => {`,
        '    if (DEVELOPMENT_MODE) {',
        `       ${comment}`,
        '       window.google.script.run.log(payload);',
        '    }',
        '};',
        '',
        `Vue.prototype.$errorHandler = (e${type}) => {`,
        `    ${comment}`,
        '    window.google.script.run.errorHandler(e);',
        '};',
        ''
    ].join('\n');
    
    lineIndex = lines.findIndex(line => line.match(/new Vue/));
    lines[lineIndex - 1] += code;

    return lines.join('\n');
};

const vueComponent = (content, api, options) => {

    const style = [
        '',
        '<style>',
        '    .dummy { margin: 0; }',
        '</style>'
    ].join('\n');

    return /<style.*?>[^]*?<\/style>/.test(content) ? content : content + style;
};

const envFile = (content, api, options) => {
    const  { appName } = options;
    return [
        'VUE_APP_SIMULATE_INSTALLED = false',
        'VUE_APP_DEVELOPMENT_MODE = false',
        `VUE_APP_TITLE = ${appName}`,
        'VUE_APP_FAVICON = https://raw.githubusercontent.com/vuejs/vue-cli/eda048a0fce9bdd3ddb423d8c5f58e1448acc897/docs/.vuepress/public/icons/favicon-16x16.png'
    ].join('\n') + content;
};

const eslintrcFile = (content, api, options) => {

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

const eslintignoreFile = (content, api, options) => {
    return '*.output.js';
};

const licenseFile = (content, api, options) => {

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

const gitignoreFile = (content, api, options) => {

    const { appName } = options;

    return content + [
        '',
        '# Added by vue-cli-plugin-gas',
        '.env',
        '*.output.js'
    ].join('\n');
}

const indexFile = (content, api, options) => {

    const { locale } = options;

    content = content.replace(/lang="en"/, `lang="${locale}"`);
    content = content.replace(/<link rel="icon".+>/, `<link rel="icon" href="<%= process.env.VUE_APP_FAVICON %>">`);
    content = content.replace(/<%= htmlWebpackPlugin.options.title %>/g, '<%= process.env.VUE_APP_TITLE %>');

    return content;
}

const readme = (content, api, options) => {
    
    return [
        '',
        'Server files must be located in the `src/server` folder.',
        '',
        'Client files are the ones that comprise the Vue app.',
        '',
        'To deploy yor files to Google Drive, simply execute in terminal:',
        '```javascript',
        `npm run deploy // or yarn deploy`,
        '```'
    ].join('\n');
}

const vuetifyPluginFile = (content, api, options) => {

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

module.exports = {
    entryFile,
    vueComponent,
    envFile,
    eslintrcFile,
    eslintignoreFile,
    licenseFile,
    gitignoreFile,
    indexFile,
    readme,
    vuetifyPluginFile
}
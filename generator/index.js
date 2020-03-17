const camelCase = require('camelcase');
const updaters = require('../utils/fileUpdaters');
const { updateFile } = require('../utils/fileHelpers');
const getPackageExtension = require('../utils/getPackageExtension');
const clasp = require('../utils/clasp');

module.exports = (api, options) => {

    const packageName = api.generator.pkg.name;
    options.appName = camelCase(packageName, { pascalCase: true });

    api.extendPackage(getPackageExtension(api, options));

    api.render('./templates');

    api.postProcessFiles(files => {

        const { addLicense } = options;
        const usesTypescript = api.hasPlugin('typescript');
        const usesEslint = api.hasPlugin('eslint');
    
        console.log('📝 Changing files...');

        if (usesTypescript) {
            delete files['src/server/ErrorHandler.js'];
            delete files['src/server/Service.js'];
        } else {
            delete files['src/server/ErrorHandler.ts'];
            delete files['src/server/Service.ts'];
        }

        const items = {
            entryFile: api.entryFile,
            vueComponent: 'src/components/HelloWorld.vue',
            envFile: '.env',
            eslintrcFile: usesEslint ? 'src/server/.eslintrc.json' : false,
            eslintignoreFile : usesEslint ? '.eslintignore' : false,
            licenseFile: addLicense ? 'LICENSE' : false,
            gitignoreFile: '.gitignore',
            indexFile: 'public/index.html',
            readme: 'README.md',
            vuetifyPluginFile: usesTypescript && 'src/plugins/vuetify.ts' in files ? 'src/plugins/vuetify.ts' : false
        };

        Object.keys(items).forEach(updater => {
            if (items[updater]) updateFile(files, items[updater], content => updaters[updater](content, api, options));
        });
    });

    api.onCreateComplete(() => {

        const { appName, createScript } = options;
        const { login, create, clone, pull, updateManifest, updateConfig } = clasp;

        login(api, options);
        if (createScript) { create(api, options); } else { clone(api, options); }
        pull(api, options);
        const manifest = updateManifest(api, options);
        const config = updateConfig(api, options);

        api.exitLog(`Succesfully setup project '${appName}' with the following attributes:`);
        Object.keys(config).forEach(key => {
            api.exitLog(`${key}: ${config[key]}`);
        });
        api.exitLog('manifest: \n' + JSON.stringify(manifest, null, 4));

    });
}
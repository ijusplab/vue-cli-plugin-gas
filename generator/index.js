const { execSync } = require('child_process');
const { mkdirSync, existsSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } = require('fs');
const camelCase = require('camelcase');
const { updateFile } = require('../utils/fileHelpers');
const readmeUpdater = require('../utils/readmeUpdater');
const envUpdater = require('../utils/envUpdater');
const gitignoreUpdater = require('../utils/gitignoreUpdater');
const indexUpdater = require('../utils/indexUpdater');
const entryFileUpdater = require('../utils/entryFileUpdater');
const componentUpdater = require('../utils/componentUpdater');
const vuetifyUpdater = require('../utils/vuetifyUpdater');
const getLicenseText = require('../utils/getLicenseText');
const getPackageExtension = require('../utils/getPackageExtension');
const getEslintignore = require('../utils/getEslintignore');
const getEslintrc = require('../utils/getEslintrc');

module.exports = (api, options) => {

    const packageName = api.generator.pkg.name;
    options.appName = camelCase(packageName, { pascalCase: true });

    const { appName, addLicense, createScript, scriptId, scriptType, timezone } = options;

    const usesTypescript = api.hasPlugin('typescript');
    const usesEslint = api.hasPlugin('eslint');

    api.extendPackage(getPackageExtension(api, options));

    api.render('./templates');

    api.postProcessFiles(files => {

        console.log('📝 Changing files...');
        execSync('echo changing files...');

        if (!files['README.md']) files['README.md'] = '\n ';
        if (!files['.env']) files['.env'] = '\n ';
        if (usesTypescript) {
            delete files['src/server/ErrorHandler.js'];
            delete files['src/server/Service.js'];
        } else {
            delete files['src/server/ErrorHandler.ts'];
            delete files['src/server/Service.ts'];
        }

        updateFile(files, 'README.md', content => readmeUpdater(content, options));
        updateFile(files, 'public/index.html', content => indexUpdater(content, options));
        updateFile(files, '.env', content => envUpdater(content, options));
        updateFile(files, '.gitignore', content => gitignoreUpdater(content, options));
        updateFile(files, api.entryFile, content => entryFileUpdater(content, { usesTypescript, usesEslint }));
        updateFile(files, 'src/components/HelloWorld.vue', content => componentUpdater(content, options));

        if (addLicense) files['LICENSE'] = getLicenseText(options);

        if (usesTypescript && 'src/plugins/vuetify.ts' in files) updateFile(files, 'src/plugins/vuetify.ts', content => vuetifyUpdater(content, { usesTypescript, usesEslint }));

        if (usesEslint) {
            files['.eslintignore'] = getEslintignore();
            files['src/server/.eslintrc.json'] = getEslintrc(api);
        }
    });

    api.onCreateComplete(() => {

        if (!existsSync(api.resolve('dist'))) mkdirSync(api.resolve('dist'));

        console.log('🔑 Launching clasp login...');
        execSync('echo lauching clasp login...');
        execSync('clasp login');
        if (createScript) {
            console.log('📝 Creating new script...');
            execSync('echo creating new script...');
            execSync(`cd ${api.resolve('dist')} && cd .. && clasp create --type ${scriptType} --title "${appName}" --rootDir ./dist`);
        } else {
            console.log('📝 Setting up existing script...');
            execSync('echo setting up existing script...');
            execSync(`cd ${api.resolve('dist')} && cd .. && clasp create --title "${appName}" --parentId "${scriptId}" --rootDir ./dist`);
        }

        if (existsSync(api.resolve('dist', 'appsscript.json'))) {
            copyFileSync(api.resolve('dist', 'appsscript.json'), api.resolve('src', 'server', 'appsscript.json'));
            unlinkSync(api.resolve('dist', 'appsscript.json'));
            let manifest = JSON.parse(readFileSync(api.resolve('src', 'server', 'appsscript.json'), { encoding: 'utf-8' }));
            manifest.timeZone = timezone;
            writeFileSync(api.resolve('src', 'server', 'appsscript.json'), JSON.stringify(manifest, null, 4));
        } else {
            console.log(`File 'appsscript.json' not found.`);
        }

        if (existsSync(api.resolve('.clasp.json'))) {
            let claspConfig = JSON.parse(readFileSync(api.resolve('.clasp.json'), { encoding: 'utf-8' }));
            writeFileSync(api.resolve('.clasp.json'), JSON.stringify(claspConfig, null, 4));
            api.exitLog(`Succesfully setup project '${appName}' with the following attributes:`);
            Object.keys(claspConfig).forEach(key => {
                api.exitLog(`${key}: ${claspConfig[key]}`);
            });
            if (existsSync(api.resolve('src', 'server', 'appsscript.json'))) {
                let manifest = JSON.parse(readFileSync(api.resolve('src', 'server', 'appsscript.json'), { encoding: 'utf-8' }));
                api.exitLog('manifest: \n' + JSON.stringify(manifest, null, 4));
            }
        } else {
            console.log(`File '.clasp.json' not found.`);
        }
    });
}
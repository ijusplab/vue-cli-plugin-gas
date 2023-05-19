const camelCase = require('camelcase');
const getPackageExtension = require('../utils/getPackageExtension');
const { Installer } = require('../utils/claspHelpers');
const FileUpdater = require('../utils/fileUpdater');
const { info } = require('../utils/logHelpers');

module.exports = (api, options) => {

  const packageName = api.generator.pkg.name;
  options.appName = camelCase(packageName, { pascalCase: true });

  api.extendPackage(getPackageExtension(api, options));

  api.render('./templates');

  const vue = require('vue');
  const [major, minor, patch] = vue.version.split('.').map(n => parseInt(n, 10));
  if (major === 2) {
    api.injectImports(api.entryFile, `import './plugins/gas';`);
  } else if (major === 3) {
    api.injectImports(api.entryFile, `import VueGasPlugin from '@ijusplab/vue-cli-plugin-gas/utils/VueGasPlugin'`);
  }

  api.postProcessFiles(files => {

    const { addLicense } = options;
    const usesTypescript = api.hasPlugin('typescript');
    const usesEslint = api.hasPlugin('eslint');

    info('📝 Changing files...');

    const updater = new FileUpdater(api, options, files);

    updater.delete([
      usesTypescript ? 'src/server/ErrorHandler.js' : 'src/server/ErrorHandler.ts',
      usesTypescript ? 'src/server/Service.js' : 'src/server/Service.ts'
    ]);

    updater.update({
      entryFile: (major === 3) ? api.entryFile : false,
      vueComponent: 'src/components/HelloWorld.vue',
      envFile: '.env',
      eslintrcFile: usesEslint ? 'src/server/.eslintrc.json' : false,
      eslintignoreFile: usesEslint ? '.eslintignore' : false,
      licenseFile: addLicense ? 'LICENSE' : false,
      gitignoreFile: '.gitignore',
      indexFile: 'public/index.html',
      tsConfig: usesTypescript ? 'tsconfig.json' : false
    });
  });

  api.onCreateComplete(() => {

    const installer = new Installer(api, options);
    api.exitLog(installer.setup());
    installer.open();

  });
}

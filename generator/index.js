const camelCase = require('camelcase');
const getPackageExtension = require('../utils/getPackageExtension');
const { Installer } = require('../utils/claspHelpers');
const FileUpdater = require('../utils/fileUpdater');
const { info } = require('../utils/logHelpers');

module.exports = (api, options, rootOptions) => {
  const isVue3 = (rootOptions.vueVersion === '3')

  const packageName = api.generator.pkg.name;
  options.appName = camelCase(packageName, { pascalCase: true });

  api.extendPackage(getPackageExtension(api, options));

  api.render('./templates');

  if (isVue3) {
    api.injectImports(api.entryFile, `import VueGasPlugin from '@ijusplab/vue-cli-plugin-gas/utils/VueGasPlugin'`);
  } else {
    api.injectImports(api.entryFile, `import './plugins/gas';`);
  }

  api.postProcessFiles(files => {

    const { addLicense } = options;
    const usesTypescript = api.hasPlugin('typescript');
    const usesEslint = api.hasPlugin('eslint');

    info('📝 Changing files...');

    const updater = new FileUpdater(api, options, files);

    updater.delete([
      isVue3 ? 'src/plugins/gas.js' : '',
      usesTypescript ? 'src/server/Service.js' : 'src/server/Service.ts'
    ]);

    updater.update({
      entryFile: (isVue3) ? api.entryFile : false,
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

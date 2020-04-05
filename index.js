const ts2gas = require('ts2gas');
const path = require('path');
const getCDNModules = require('./utils/getCDNModules');
const { Service } = require('./utils/claspHelpers');
const CustomWebpackPlugin = require('./utils/CustomWebpackPlugin');
const updateMethodsList = require('./utils/updateMethodsList');
const { info } = require('./utils/logHelpers');

const injectEnvironment = content => {
  return Object.keys(process.env).reduce((result, key) => {
    if (/^VUE_APP/.test(key) || /^GAS_APP/.test(key)) {
      let pattern = new RegExp(`process\\.env\\.${key}`, 'g');
      if (pattern.test(result)) {
        result = result.replace(pattern, `"${process.env[key]}"`);
      }
    }
    return result;
  }, content);
};

module.exports = (api, options) => {

  const usesTypescript = api.hasPlugin('typescript');

  const src = api.resolve('src');
  const server = api.resolve('src/server');
  const dist = api.resolve('dist');

  const service = new Service(api);
  const { build } = api.service.commands  

  api.chainWebpack(config => {

    const tsOptions = {
      compilerOptions: {
        experimentalDecorators: true,
        isolatedModules: true,
        module: 'None',
        noImplicitUseStrict: true,
        noLib: true,
        noResolve: true,
        target: 'ESNEXT'
      }
    };

    config
      .devtool(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'custom-watch' ? 'none' : 'eval-source-map')
      .plugin('copy')
      .use(require('copy-webpack-plugin'), [
        [
          {
            from: server,
            ignore: usesTypescript ? ['.*.js', '*.js', '*.json'] : ['.*.js', '*.json'],
            to: path.resolve(dist, '[name].gs'),
            transform: content => usesTypescript ? ts2gas(injectEnvironment(content.toString()), tsOptions) : injectEnvironment(content.toString())
          },
          {
            from: path.resolve(server, 'appsscript.json'),
            to: dist
          }
        ]
      ])
      .end();

    config
      .plugin('html-ext-script')
      .after('html')
      .use(require('script-ext-html-webpack-plugin'), [
        {
          inline: 'app.js'
        }
      ])
      .end()
      .plugin('html-ext-style')
      .after('html-ext-script')
      .use(require('style-ext-html-webpack-plugin'), [
        {
          chunks: ['app']
        }
      ])
      .end()
      .plugin('cdn')
      .after('html-ext-style')
      .use(require('webpack-cdn-plugin'), [
        {
          modules: getCDNModules(api),
          publicPath: '/node_modules'
        }
      ]);

    if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_WATCH_MODE !== 'true') {
      config.plugin('custom-plugin')
        .use(CustomWebpackPlugin, [{
          hook: 'watchRun',
          callback: () => updateMethodsList(api.resolve('src'))
        }]);
    }

    if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_WATCH_MODE === 'true') {
      config.plugin('custom-plugin')
        .use(CustomWebpackPlugin, [{
          hook: 'done',
          callback: () => service.push('--force')
        }]);
    }

  });

  api.registerCommand('pull',
    {
      description: 'Pushes the GAS script to Google Drive for testing, without minification',
      usage: 'vue-cli-service pull'
    },
    args => {
      info('\nGetting files from Google Drive...\n');
      service.clearDist();
      service.pull();
    }
  );

  api.registerCommand('push',
    {
      description: 'Pushes the GAS script to Google Drive for testing, without minification',
      usage: 'vue-cli-service push [options]',
      options: {
        '--mode': 'Set NODE_ENV mode'
      }
    },
    args => {
      process.env.VUE_APP_WATCH_MODE = 'false';
      info('\nSyncing manifest file...\n');
      service.pull();
      service.updateManifest();
      if (args && args.watch )delete args.watch;
      return build.fn(args).then(() => {
        info('\nUpdating files in Google Drive...\n');
        service.push();
      });
    }
  );

  api.registerCommand('watch',
    {
      description: 'Merges remote manifest with local and updates both',
      usage: 'vue-cli-service syncmanifest'
    },
    args => {
      process.env.VUE_APP_WATCH_MODE = 'true';
      info('\nSyncing manifest file...\n');
      service.pull();
      service.updateManifest();
      args.watch = true;
      return build.fn(args).then(() => {
        process.env.VUE_APP_WATCH_MODE = 'false';
      });
    }
  );

  api.registerCommand('deploy',
    {
      description: 'Deploys the GAS script to Google Drive for production, fully minified, and updates version',
      usage: 'vue-cli-service deploy [options]',
      options: { '--description ': 'The deployment description.' }
    },
    args => {
      process.env.VUE_APP_WATCH_MODE = 'false';
      info('\nSyncing manifest file...\n');
      service.pull();
      service.updateManifest();
      if (args && args.watch )delete args.watch;
      return build.fn(args).then(() => {
        info('\nUpdating files in Google Drive...\n');
        service.push();
        info('\nUpdating project version...\n');
        service.deploy(args.description ? `--description ${args.description}` : null);
      });
    }
  );

  api.registerCommand('syncmanifest',
    {
      description: 'Merges remote manifest with local and updates both',
      usage: 'vue-cli-service syncmanifest'
    },
    args => {
      info('\nSyncing manifest file...\n');
      service.pull();
      service.updateManifest();
      service.clearDist();
    }
  );

  api.registerCommand('login',
    {
      description: 'Merges remote manifest with local and updates both',
      usage: 'vue-cli-service syncmanifest'
    },
    args => {
      service.authenticate();
    }
  );

}

module.exports.defaultModes = {
  deploy: 'production',
  pull: 'development',
  push: 'development',
  watch: 'development',
  syncmanifest: 'development'
}
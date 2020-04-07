module.exports = (api, { addLicense, licenseName }) => {

  let config = {
    vue: {
      filenameHashing: false,
      css: {
        extract: true
      },
      pages: {
        app: {
          entry: api.entryFile,
          template: 'public/index.html',
          filename: 'index.html',
          chunks: ['app'],
          minify: false // very important to assure that urls inserted in the template get their quotation marks
        }
      },
      configureWebpack: config => {
        config.watchOptions = {
          ignored: /node_modules/,
          aggregateTimeout: 1000            
        };
        config.devServer = {
          watchOptions: {
            ignored: /node_modules/
          },
          before: function (app, server, compiler) {
            let googleMock = '@ijusplab/vue-cli-plugin-gas/google.mock'
            if (googleMock in config.externals) delete config.externals[googleMock]
          }
        };
        config.optimization = {
          splitChunks: false,
          minimize: process.env.NODE_ENV === 'production'
        };
        config.externals = {
          'vue': 'Vue',
          'vuex': 'Vuex',
          'vue-router': 'VueRouter',
          'vuetify/dist/vuetify.min.css': 'undefined',
          'vuetify/lib': 'Vuetify',
          '@ijusplab/vue-cli-plugin-gas/google.mock': 'google'
        };
      },
      chainWebpack: config => {
        config.module
          .rule('images')
          .use('url-loader')
          .loader('url-loader')
          .tap(options => {
            options.limit = true;
            return options;
          });

        config.module
          .rule('vue')
          .use('vue-svg-inline-loader')
          .loader('vue-svg-inline-loader')
          .options({ /* ... */ });

        if (config.plugins.has('preload-app')) config.plugins.delete('preload-app');
        if (config.plugins.has('prefetch-app')) config.plugins.delete('prefetch-app');
        if (config.plugins.has('VuetifyLoaderPlugin')) config.plugins.delete('VuetifyLoaderPlugin');
      }
    },
    scripts: {
      "change-timezone": "vue-cli-service change-timezone",
      "deploy": "vue-cli-service deploy",
      "push": "vue-cli-service push",
      "pull": "vue-cli-service pull",
      "watch": "vue-cli-service watch",
      "inspect": "vue-cli-service inspect --mode development > wp.dev.output.js && vue-cli-service inspect --mode production > wp.prod.output.js"
    },
    devDependencies: {
      "@types/google-apps-script": "^1.0.10",
      "@types/node": "^13.9.0",
      "copy-webpack-plugin": "^5.1.1",
      "script-ext-html-webpack-plugin": "^2.1.4",
      "style-ext-html-webpack-plugin": "^4.1.2",
      "ts2gas": "^3.6.1",
      "webpack-cdn-plugin": "^3.2.2",
      "vue-svg-inline-loader": "^1.4.6"
    }
  };

  if (addLicense) config.license = licenseName;

  return config;
}
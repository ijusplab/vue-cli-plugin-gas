const ts2gas = require('ts2gas');
const path = require('path');
const getCDNModules = require('./utils/getCDNModules');

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

    api.configureWebpack(config => {
        config.optimization = {
            splitChunks: false
            // minimize: true
        };
        config.externals = {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'vuetify/dist/vuetify.min.css': 'undefined',
            'vuetify/lib': 'Vuetify'
        };
    });

    api.chainWebpack(config => {

        const server = api.resolve('src/server');
        const dist = api.resolve('dist');

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

        config
            .devtool(false)
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
    });
}
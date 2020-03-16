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
                  filename: '_index.html',
                  chunks: ['app'],
                  minify: false
                }
            }, 
            chainWebpack: config => {
                if (config.plugins.has('VuetifyLoaderPlugin')) config.plugins.delete('VuetifyLoaderPlugin');
            }
        },
        scripts: {
            "deploy": "npm run update-manifest && npm run --silent build && npm run --silent deploying-message && clasp push",
            "deploying-message": "echo calling clasp push...",
            "update-manifest": "clasp pull && cp ./dist/appsscript.json ./src/server/appsscript.json && rm -r ./dist/*"
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
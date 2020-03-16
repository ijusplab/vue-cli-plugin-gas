module.exports = (api) => {

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

    return JSON.stringify(config);
}
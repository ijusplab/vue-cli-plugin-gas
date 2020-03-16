module.exports = (content, { appName }) => {
    return [
        'VUE_APP_SIMULATE_INSTALLED = false',
        'VUE_APP_DEVELOPMENT_MODE = false',
        `VUE_APP_TITLE = ${appName}`,
        'VUE_APP_FAVICON = https://raw.githubusercontent.com/vuejs/vue-cli/eda048a0fce9bdd3ddb423d8c5f58e1448acc897/docs/.vuepress/public/icons/favicon-16x16.png'
    ].join('\n') + content;
}
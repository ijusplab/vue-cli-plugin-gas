module.exports = (content, { appName }) => {
    return [
        'VUE_APP_SIMULATE_INSTALLED = false',
        'VUE_APP_DEVELOPMENT_MODE = false',
        `VUE_APP_TITLE = ${appName}`,
        'VUE_APP_FAVICON = https://github.com/ijusplab/Identidade-Visual/blob/66a39374709693667bac2657a503badc471f616f/src/logos/incubadora/logo_incubadora_favicon.png'
    ].join('\n') + content;
}
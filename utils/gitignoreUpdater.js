module.exports = (content, { appName }) => {
    return content + [
        '',
        '# Added by vue-cli-plugin-gas',
        '.env',
        '*.output.js'
    ].join('\n');
}
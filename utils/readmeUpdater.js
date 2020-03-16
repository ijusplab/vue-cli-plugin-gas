module.exports = (content, { addLicense, licenseName }) => {
    return [
        '',
        'Server files must be located in the `src/server` folder.',
        '',
        'Client files are the ones that comprise the Vue app.',
        '',
        'To deploy yor files to Google Drive, simply execute in terminal:',
        '```javascript',
        `npm run deploy // or yarn deploy`,
        '```'
    ].join('\n');
}
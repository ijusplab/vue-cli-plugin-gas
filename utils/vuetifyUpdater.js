module.exports = (content, {}) => {

    const lines = content.split(/\r?\n/g);

    lines[0] = [
        '/* eslint-disable  @typescript-eslint/ban-ts-ignore */',
        '',
        lines[0]
    ].join('\n');

    let lineIndex = lines.findIndex(line => line.match(/import Vuetify/));
    lines[lineIndex] = '//@ts-ignore\n' + lines[lineIndex];

    return lines.join('\n');
}
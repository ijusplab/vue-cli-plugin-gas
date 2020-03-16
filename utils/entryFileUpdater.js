const getSnippet = (usesTypescript) => {
    const type = usesTypescript ? ': any' : '';
    const comment = usesTypescript ? '// @ts-ignore' : '';
    return `
Vue.prototype.$log = (payload${type}) => {
    if (DEVELOPMENT_MODE) {
        ${comment}
        window.google.script.run.log(payload);
    }
};

Vue.prototype.$errorHandler = (e${type}) => {
    ${comment}
    window.google.script.run.errorHandler(e);
};
`;
}

module.exports = (content, { usesTypescript, usesEslint }) => {

    const lines = content.split(/\r?\n/g);

    if (usesTypescript && usesEslint) {
        lines[0] = [
            '/* eslint-disable  @typescript-eslint/ban-ts-ignore */',
            '/* eslint-disable  @typescript-eslint/no-explicit-any */',
            '',
            lines[0]
        ].join('\n');    
    }

    let lineIndex = lines.findIndex(line => line.match(/Vue.config/));
    lines[lineIndex] += `\n\nconst DEVELOPMENT_MODE = process.env.VUE_APP_DEVELOPMENT_MODE === 'true';`;

    if (usesTypescript && /vuetify,/.test(content)) {
        lineIndex = lines.findIndex(line => line.match(/vuetify,/));
        lines[lineIndex] = '\t//@ts-ignore\n' + lines[lineIndex];
    }

    lineIndex = lines.findIndex(line => line.match(/new Vue/));
    lines[lineIndex - 1] += getSnippet(usesTypescript);

    return lines.join('\n');
}
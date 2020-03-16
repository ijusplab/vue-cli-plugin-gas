const licenseList = require('spdx-license-list/full');

const replaceInLicense = (licenseTextTemplate, sourceText, newText) => {
    return licenseTextTemplate.replace(new RegExp(`<${sourceText}>`), newText)
        .replace(new RegExp(`\\[${sourceText}\\]`), newText)
}

module.exports = ({ copyrightHolders, licenseName }) => {

    const licenseTextTemplate = licenseList[licenseName].licenseText;
    const year = new Date().getFullYear();
    const licenseText = replaceInLicense(licenseTextTemplate, 'year', year);

    return replaceInLicense(licenseText, 'copyright holders', copyrightHolders);
}
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const login = (api, options) => {
    console.log('🔑 Launching clasp login...');
    execSync('clasp login');
};

const mkdir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

const create = (api, options) => {
    mkdir(api.resolve('dist'));
    const { scriptType, appName } = options;
    console.log('📝 Creating new script...');
    execSync(`cd ${api.resolve('dist')} && cd .. && clasp create --type ${scriptType} --title "${appName}" --rootDir ./dist`);
};

const clone = (api, options) => {
    mkdir(api.resolve('dist'));
    const { scriptId } = options;
    console.log('📝 Setting up existing script...');
    execSync(`cd ${api.resolve('dist')} && cd .. && clasp clone "${scriptId}" --rootDir ./dist`);
};

const moveFiles = (src, dest, filter) => {
    if (fs.lstatSync(src).isDirectory()) {
        fs.readdirSync(src).forEach(item => {
            moveFiles(path.join(src, item), dest, filter);
        })
    } else {
        if (filter(src)) {
            fs.writeFileSync(path.join(dest, path.basename(src)), fs.readFileSync(src, { encoding: 'utf-8' }));
            fs.unlinkSync(src);
        }
    }
};

const pull = (api, options) => {
    mkdir(api.resolve('dist'));
    moveFiles(api.resolve('dist'), api.resolve('src', 'server'), file => path.extname(file) === '.js' || path.basename(file) === 'appsscript.json');
    moveFiles(api.resolve('dist'), api.resolve('src', 'components'), file => path.extname(file) === '.html');
};

const updateManifest = (api, options) => {
    const { timezone } = options;
    let manifest = {};
    if (fs.existsSync(api.resolve('src', 'server', 'appsscript.json'))) {
        manifest = JSON.parse(fs.readFileSync(api.resolve('src', 'server', 'appsscript.json'), { encoding: 'utf-8' }));
        manifest.timeZone = timezone;
        fs.writeFileSync(api.resolve('src', 'server', 'appsscript.json'), JSON.stringify(manifest, null, 4));
    } else {
        console.warn(`File 'appsscript.json' not found.`);
    }
    return manifest;
}

const updateConfig = (api, options) => {
    let config = {};
    if (fs.existsSync(api.resolve('.clasp.json'))) {
        config = JSON.parse(fs.readFileSync(api.resolve('.clasp.json'), { encoding: 'utf-8' }));
        fs.writeFileSync(api.resolve('.clasp.json'), JSON.stringify(config, null, 4));
    } else {
        console.warn(`File '.clasp.json' not found.`);
    }
    return config;
};

module.exports = {
    login,
    create,
    clone,
    pull,
    updateManifest,
    updateConfig
}

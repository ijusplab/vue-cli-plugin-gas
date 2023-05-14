const { execSync } = require('child_process');
const path = require('path');
const { info, warn } = require('./logHelpers');
const { mkdir, clearDir, moveFiles, copyFiles, deleteFiles, getJson, setJson } = require('./fileHelpers');

const getEmail = (str) => {
  let pattern = /[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/;
  if (pattern.test(str)) {
    return pattern.exec(str)[0];
  } else {
    return '';
  }
};

const merge = (...arguments) => {
  let target = {};
  let merger = (obj) => {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop] !== null && obj[prop] !== undefined) {
        if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          target[prop] = merge(target[prop], obj[prop]);
        } else {
          target[prop] = obj[prop];
        }
      }
    }
  };
  for (let i = 0; i < arguments.length; i++) {
    merger(arguments[i]);
  }
  return target;
};

const getPaths = (api) => {
  mkdir(api.resolve('dist'));
  return {
    root: path.resolve(api.resolve('src'), '..'),
    src: api.resolve('src'),
    dist: api.resolve('dist'),
    server: path.join(api.resolve('src'), 'server'),
    components: path.join(api.resolve('src'), 'components'),
    manifest: {
      basename: 'appsscript.json',
      local: path.join(api.resolve('src'), 'server', 'appsscript.json'),
      remote: path.join(api.resolve('dist'), 'appsscript.json')
    },
    config: path.resolve(api.resolve('src'), '..', '.clasp.json')
  }
};

const isInstalled = () => {
  try {
    const raw = execSync('clasp --version').toString()
    let [major, minor, patch] = raw.split('.').map(n => parseInt(n, 10));
    let min = '2.4.1';
    let isCompatible = major > 2 || (major === 2 && minor >= 4 && patch >= 1 );
    return { major, minor, patch, raw, min, isCompatible };
  } catch (e) {
    console.error(e);
    return false;
  }
};

const isLogged = () => {
  let user = getEmail(execSync('clasp login --status'));
  return user.length > 0 ? user : false;
};

const claspNative = (command, options, context) => {
  execSync(`cd ${context.root} && clasp ${command}` + (options ? ` ${options}` : ''), { stdio: 'inherit' });
}

const create = (context, { scriptType, appName }) => {
  if (!scriptType) throw new Error('ScriptType not defined');
  if (!appName) throw new Error('AppName not defined');
  execSync(`cd ${context.root} && clasp create --type ${scriptType} --title "${appName}" --rootDir ./dist`, { stdio: 'inherit' });
  moveFiles(path.resolve(context.dist, '.clasp.json'), context.root)
};

const clone = (context, { scriptId }) => {
  if (!scriptId) throw new Error('ScriptId not defined');
  execSync(`cd ${context.root} && clasp clone "${scriptId}" --rootDir ./dist`, { stdio: 'inherit' });
};

const setManifest = (context, data) => {
  let manifest = getJson(context.manifest.remote) || {};
  if (data) manifest = merge(manifest, data);
  setJson(context.manifest.local, manifest);
};

const updateManifest = (context, data) => {
  let manifest = getJson(context.manifest.remote) || {};
  let local = getJson(context.manifest.local) || {};
  manifest = merge(manifest, local);
  if (data) manifest = merge(manifest, data);
  setJson(context.manifest.local, manifest);
};

const getTimeZone = (context) => {
  let manifest = getJson(context.manifest.local) || {};
  return manifest.timeZone ? manifest.timeZone : null;
};

const updateConfig = (context) => {
  let config = getJson(context.config);
  if (config) {
    setJson(context.config, config); // just to make the get the file formatted
  }
};

const updateLocalFiles = (context) => {
  moveFiles(context.dist, context.server, file => path.extname(file) === '.js' || path.extname(file) === '.json');
  moveFiles(context.dist, context.components, file => path.extname(file) === '.html');
};

const checkVersion = () => {

  let version = isInstalled();
  if (!version) throw new Error('Clasp not installed');

  if (version.isCompatible) {
    info(`Clasp version ${version.raw} detected...`);
  } else {
    warn(`Clasp version ${version.raw} detected...`);
    warn(`You need to upgrade at least to version ${version.min}`);
  }
};

const authenticate = (context) => {
  let user = isLogged();
  if (user) {
    info(`🔑 Already logged in Clasp as ${user}`);
    return user;
  }
  info('🔑 Launching clasp login...');
  claspNative('login', null, context);
  return isLogged();
};

const setProject = (context, { createScript, scriptId, scriptType, appName }) => {  
  info('⚙️ Setting up project with Clasp...');
  clearDir(context.dist);
  if (createScript) {
    info('📝 Creating new script...');
    create(context, { scriptType, appName });
  } else {
    info('📝 Cloning existing script...');
    clone(context, { scriptId });
  }
};

const adjustSettings = (context, { timeZone, createScript }) => {
  info('⚙️ Adjusting Clasp settings...');
  if (createScript) {
    setManifest(context, { timeZone });
    copyFiles(context.manifest.local, context.dist);
    claspNative('push', '--force', context);
  } else {
    copyFiles(context.manifest.remote, context.server);
  }
  clearDir(context.dist);
  updateConfig(context);
};

const setup = (context, { appName, createScript, scriptType, scriptId, timeZone }) => {

  checkVersion();
  deleteFiles(context.config); // delete .clasp.json if it exists
  authenticate(context);
  setProject(context, { createScript, scriptId, scriptType, appName });
  adjustSettings(context, { timeZone, createScript });

  return `👏🏽 Project '${appName}' succesfully created.`;
};

class Installer {

  constructor(api, options) {
    this.context = getPaths(api);
    this.setup = () => setup(this.context, options);
    this.open = () => claspNative('open', null, this.context);
  }
}

class Service {

  constructor(api) {
    this.context = getPaths(api);
    this.version = isInstalled();
    if (!this.version) throw new Error('Clasp not installed');
    this.isLogged = isLogged();
    if (!this.isLogged) {
      authenticate();
    }
  }

  claspNative(command, options) {
    return claspNative(command, options, this.context);
  }

  push(options) {
    return claspNative('push', options, this.context);
  }

  pull(options) {
    return claspNative('pull', options, this.context);
  }

  deploy(options) {
    return claspNative('deploy', options, this.context);
  }

  updateManifest(data) {
    updateManifest(this.context, data);
  }

  getTimeZone() {
    return getTimeZone(this.context);
  }

  updateLocalFiles() {
    return updateLocalFiles(this.context);
  }

  clearDist() {
    clearDir(this.context.dist);
  }

}

module.exports = { Installer, Service }

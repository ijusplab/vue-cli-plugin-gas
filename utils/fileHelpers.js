const { existsSync, mkdirSync, lstatSync, readdirSync, readFileSync, writeFileSync, unlinkSync } = require('fs');
const path = require('path');
const { warn } = require('./logHelpers');

const mkdir = (dir) => {
  if (!existsSync(dir)) mkdirSync(dir);
};

const clearDir = (dir) => {
  readdirSync(dir).forEach(file => {
    unlinkSync(path.join(dir, file));
  });
};

const moveFiles = (src, dest, filter) => {
  if (lstatSync(src).isDirectory()) {
    readdirSync(src).forEach(item => {
      moveFiles(path.join(src, item), dest, filter);
    })
  } else {
    if (!filter || filter(src)) {
      writeFileSync(path.join(dest, path.basename(src)), readFileSync(src, { encoding: 'utf-8' }));
      unlinkSync(src);
    }
  }
};

const copyFiles = (src, dest, filter) => {
  if (lstatSync(src).isDirectory()) {
    readdirSync(src).forEach(item => {
      moveFiles(path.join(src, item), dest, filter);
    })
  } else {
    if (!filter || filter(src)) {
      writeFileSync(path.join(dest, path.basename(src)), readFileSync(src, { encoding: 'utf-8' }));
    }
  }
};

const deleteFiles = (fullPath, filter) => {
  if (!existsSync(fullPath)) return;
  if (lstatSync(fullPath).isDirectory()) {
    readdirSync(fullPath).forEach(item => {
      removeFiles(path.join(fullPath, item), filter);
    })
  } else {
    if (!filter || filter(fullPath)) {
      unlinkSync(fullPath);
    }
  }
};

const getJson = (fullPath) => {
  if (!/\.json$/.test(fullPath)) {
    throw new Error(`${path.basename(fullPath)} is not a json file`);
  };
  if (existsSync(fullPath)) {
    return JSON.parse(readFileSync(fullPath, { encoding: 'utf-8' }));
  } else {
    warn(`File '${path.basename(fullPath)}' not found.`);
    return null;
  }
};

const setJson = (fullPath, contentAsObject) => {
  if (!/\.json$/.test(fullPath)) {
    throw new Error(`${path.basename(fullPath)} is not a json file`);
  };
  writeFileSync(fullPath, JSON.stringify(contentAsObject, null, 2));
};

module.exports = {
  mkdir,
  clearDir,
  moveFiles,
  copyFiles,
  deleteFiles,
  getJson,
  setJson
}
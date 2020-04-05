const { readdirSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');
const { info } = require('./logHelpers');

const updateMethodsList = (context) => {

  const serverPath = path.join(context, 'server');
  const destination = path.join(context, 'google.mock', 'methods.json');

  let methods = readdirSync(serverPath).filter(file => /\.[tj]s$/.test(file)).reduce((list, file) => {
    let content = readFileSync(path.join(serverPath, file), 'utf8');
    [
      /function\s+?(.+?)\s*?\(.*?\)/gm, // captures function name in Group 1
      /(const|let|var)\s+?(.+?)\s*?=\s*?(function)*\s*?\(.*?\)/gm // captures function name in Group 2
    ]
      .forEach((pattern, index) => {
        if (pattern.test(content)) {
          let matches = content.match(pattern);
          matches.forEach(match => {
            pattern.lastIndex = 0;
            let fn = pattern.exec(match)[index + 1];
            if (!/_$/.test(fn)) list.push(fn);
          })
        }
      });
      return list;
  }, [])
  .filter((v, i, arr) => arr.indexOf(v) === i);
  writeFileSync(destination, JSON.stringify(methods, null, 2));
  info('\nFile src/google.mock/methods.json updated\n');
};

module.exports = updateMethodsList;
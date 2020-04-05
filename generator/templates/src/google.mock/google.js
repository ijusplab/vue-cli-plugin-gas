/* eslint-disable */
const methods = require ('./methods.json');

const getParamsString = (params) => {
  if (params === null || params === undefined)
    return '';
  return '?' + Object.keys(params).map(key => {
    return Array.isArray(params[key]) ? params[key].map(val => `${key}=${val}`).join('&') : `${key}=${params[key]}`;
  }).join('&');
};

const getParamsObject = (str) => {
  return str.replace(/^\?/, '').split('&').reduce((obj, frag) => {
    let pair = frag.split('=');
    obj[pair[0]] = pair[0] in obj ? Array.prototype.concat(obj[pair[0]], pair[1]) : [pair[1]];
    return obj;
  }, {});
};

const getParamObject = (str) => {
  return str.replace(/^\?/, '').split('&').reduce((obj, frag) => {
    let pair = frag.split('=');
    if (!(pair[0] in obj)) {
      obj[pair[0]] = pair[1];
    }
    return obj;
  }, {});
};

const getHashString = (hash) => {
  if (hash === null || hash === undefined)
    return '';
  return '#' + hash;
};

const history = {
  push(stateObject, params, hash) {
    window.history.pushState(stateObject, null, getParamsString(params) + getHashString(hash));
  },
  replace(stateObject, params, hash) {
    window.history.replaceState(stateObject, null, getParamsString(params) + getHashString(hash));
  },
  setChangeHandler(fn) {
    window.onpopstate = fn;
  }
};

const host = {
  close() {
    console.log('In production, this would have closed the current dialog or sidebar...');
  },
  editor: {
    focus() {
      console.log('In production, this would have changed focus from the dialog or sidebar to the Google Docs, Sheets, or Forms editor...');
    }
  },
  setHeight(height) {
    console.log(`In production, this would have changed the height of the current dialog to ${height}...`);
  },
  setWidth(width) {
    console.log(`In production, this would have changed the width of the current dialog to ${width}...`);
  }
};

class Runner {
  static withFailureHandler(fn) {
    this.failureHandler = fn;
    return this;
  }
  static withSuccessHandler(fn) {
    this.successHandler = fn;
    return this;
  }
  static withUserObject(obj) {
    this.userObject = obj;
    return this;
  }
}

methods.forEach(method => {
  // eslint-disable-next-line no-unused-vars
  Runner[method] = function(args) {
    console.log(`In production, this would have run the server-side ${method} method...`);
    if (this.successHandler) {
      this.successHandler('in case of success it would respond within the successHandler callback, with the following user object:', this.userObject);
    }
    if (this.failureHandler) {
      this.failureHandler('in case of failure it would respond within the failureHandler callback, with the following user object:', this.userObject);
    }
  }
  .bind(Runner);
})

const url = {
  getLocation(fn) {
    const location = document.location;
    const parameters = getParamsObject(location.search);
    const parameter = getParamObject(location.search);
    const hash = location.hash.replace(/^#/, '');
    fn({ hash, parameter, parameters });
  }
};

module.exports = {
  script: {
    history,
    host,
    run: Runner,
    url
  }
}
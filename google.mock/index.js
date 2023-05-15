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

const enableServerMockedMethods = (obj) => {
  return new Proxy(obj, {
    get(target, key) {
      if (key in target) {
        return target[key];
      } else if (typeof target.__mockedMethod__ === "function") {
        return function(...args) {
          return target.__mockedMethod__.call(target, key, args);
        };
      }
    }
  });
}

const initializeMockData = (mockData) => {
  const mapper = new Map();
  if (mockData) {
    for (const functionName of Object.keys(mockData)) {
      mapper.set(functionName, {
        isSuccess: mockData[functionName].isSuccess ? true : false,
        response: mockData[functionName].response
      });
    }
  }
  return mapper;
}

const responseMapping = initializeMockData(__GOOGLE_MOCK_RESPONSES__);

class Runner {
  constructor() {
    return enableServerMockedMethods(this);
  }
  withFailureHandler(fn) {
    if (typeof fn !== 'function') throw new Error('You have to pass a function to withFailureHandler.')
    this.failureHandler = fn;
    return this;
  }
  withSuccessHandler(fn) {
    if (typeof fn !== 'function') throw new Error('You have to pass a function to withSuccessHandler.')
    this.successHandler = fn;
    return this;
  }
  withUserObject(obj) {
    if (typeof fn !== 'object') throw new Error('You have to pass an object to withUserObject.')
    this.userObject = obj;
    return this;
  }
  __mockedMethod__(name) {
    const style = 'color: white; font-style: bold; background-color: #0277BD; padding: 2px 5px; border-radius: 3px;'
    console.info(`In production, you would have called the server-side %c${name} method`, style);

    if (responseMapping.has(name)) {
      const mockInfo = responseMapping.get(name);
      if (mockInfo.isSuccess) {
        if (this.successHandler) {
          setTimeout(() => {
            this.successHandler(mockInfo.response, this.userObject);
          }, 0);
        }
      } else {
        if (this.failureHandler) {
          setTimeout(() => {
            this.failureHandler(mockInfo.response, this.userObject);
          }, 0);
        }
      }
    } else {
      if (this.successHandler) {
        setTimeout(() => {
          this.successHandler('in case of success it would respond within the successHandler callback, with the following user object:', this.userObject);
        }, 0);
      }
    }
  }
}

const url = {
  getLocation(fn) {
    const location = document.location;
    const parameters = getParamsObject(location.search);
    const parameter = getParamObject(location.search);
    const hash = location.hash.replace(/^#/, '');
    fn({ hash, parameter, parameters });
  }
};

class GoogleMock {
  constructor() {
    if (!!GoogleMock.instance) {
      return GoogleMock.instance;
    }
    GoogleMock.instance = this;
    this.history = history;
    this.host = host;
    this.url = url;
    this.run = new Runner();
    return this;
  }
}

export default {
  script: new GoogleMock()
}
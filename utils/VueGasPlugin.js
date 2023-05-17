export default {
  install(Vue, { google, devMode }) {
    if (devMode) {
      const style = 'color: white; font-style: bold; background-color: #BF360C; padding: 5px;'
      console.info('%c DEVELOPMENT MODE ', style)
    }
    const globalProperties = Vue.config.globalProperties !== undefined ? Vue.config.globalProperties : Vue.prototype;
    globalProperties.$google = google
    globalProperties.$devMode = devMode

    globalProperties.$callLibraryMethod = (library, method, ...args) => {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(res => resolve(res))
          .withFailureHandler(err => reject(err))
          .callback(library, method, ...args)
      })
    }

    globalProperties.$log = (payload) => {
      if (devMode) {
        google.script.run.log(payload)
      }
    }

    globalProperties.$errorHandler = (e) => {
      google.script.run.errorHandler({
        message: e.message,
        stack: e.stack
      })
    }
  }
}

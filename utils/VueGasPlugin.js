export default {
  install(Vue, { google, devMode }) {
    if (devMode) {
      const style = 'color: white; font-style: bold; background-color: #BF360C; padding: 5px;'
      console.info('%c DEVELOPMENT MODE ', style)
    }
    Vue.prototype.$google = google
    Vue.prototype.$devMode = devMode

    Vue.prototype.$callLibraryMethod = (library, method, ...args) => {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(res => resolve(res))
          .withFailureHandler(err => reject(err))
          .callback(library, method, ...args)
      })
    }

    Vue.prototype.$log = (payload) => {
      if (devMode) {
        google.script.run.log(payload)
      }
    }

    Vue.prototype.$errorHandler = (e) => {
      google.script.run.errorHandler({
        message: e.message,
        stack: e.stack
      })
    }
  }
}

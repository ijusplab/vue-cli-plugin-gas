import google from '@ijusplab/vue-cli-plugin-gas/google.mock'

export default {
  install(Vue) {
    const [major] = Vue.version.split('.').map(n => parseInt(n, 10))
    const globalProperties = major === 3 ? Vue.config.globalProperties : Vue.prototype
    globalProperties.$google = google
  }
}

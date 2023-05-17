module.exports = (api) => {

  const usesVuex = api.hasPlugin('vuex');
  const usesRouter = api.hasPlugin('router');
  const usesVuetify = api.hasPlugin('vuetify');

  const vue = require('vue');
  const [major, minor, patch] = vue.version.split('.').map(n => parseInt(n, 10));
  const vueFileName = {
    'production': {
      2: 'vue.min.js',
      3: 'vue.global.prod.js'
    },
    'development': {
      2: 'vue.js',
      3: 'vue.global.js'
    }
  };

  let modules = [
    {
      name: 'vue',
      var: 'Vue',
      path: `dist/${vueFileName[process.env.NODE_ENV][major]}`
    }
  ];

  if (usesVuex) modules.push({
    name: 'vuex',
    var: 'Vuex',
    path: 'dist/vuex.min.js'
  });

  if (usesRouter) modules.push({
    name: 'vue-router',
    var: 'VueRouter',
    path: 'dist/vue-router.js'
  });

  if (usesVuetify) modules.push({
    name: 'vuetify',
    var: 'Vuetify',
    path: 'dist/vuetify.min.js',
    style: 'dist/vuetify.min.css'
  });

  return modules;
}

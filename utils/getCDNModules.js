module.exports = (api) => {

  const usesVuex = api.hasPlugin('vuex');
  const usesRouter = api.hasPlugin('router');
  const usesVuetify = api.hasPlugin('vuetify');

  const vue = require('vue');
  const [major] = vue.version.split('.').map(n => parseInt(n, 10));
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

  const vueRouterFileName = {
    'production': {
      2: 'vue-router.min.js',
      3: 'vue-router.global.prod.js'
    },
    'development': {
      2: 'vue-router.js',
      3: 'vue-router.global.js'
    }
  };

  const vuexFileName = {
    'production': {
      2: 'vuex.min.js',
      3: 'vuex.global.prod.js'
    },
    'development': {
      2: 'vuex.js',
      3: 'vuex.global.js'
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
    path: `dist/${vuexFileName[process.env.NODE_ENV][major]}`
  });

  if (usesRouter) modules.push({
    name: 'vue-router',
    var: 'VueRouter',
    path: `dist/${vueRouterFileName[process.env.NODE_ENV][major]}`
  });

  if (usesVuetify) modules.push({
    name: 'vuetify',
    var: 'Vuetify',
    path: 'dist/vuetify.min.js',
    style: 'dist/vuetify.min.css'
  });

  return modules;
}

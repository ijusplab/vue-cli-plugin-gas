module.exports = (api) => {

  const usesVuex = api.hasPlugin('vuex');
  const usesRouter = api.hasPlugin('router');
  const usesVuetify = api.hasPlugin('vuetify');

  let modules = [
    {
      name: 'vue',
      var: 'Vue',
      path: process.env.NODE_ENV === 'production' ? 'dist/vue.min.js' : 'dist/vue.js'
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

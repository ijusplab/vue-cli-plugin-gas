module.exports = (api) => {

    const usesVuex = api.hasPlugin('vuex');
    const usesRouter = api.hasPlugin('router');
    const usesVuetify = api.hasPlugin('vuetify');

    let modules = [
        {
            name: 'vue',
            var: 'Vue',
            path: 'dist/vue.min.js'
        }
    ];

    if (usesVuex) modules.push({
        name: 'vuex',
        var: 'Vuex',
        path: 'dist/vuex.min.js'
    });

    if (usesRouter) modules.push({
        name: 'router',
        var: 'Router',
        path: 'dist/router.min.js'
    });

    if (usesVuetify) modules.push({
        name: 'vuetify',
        var: 'Vuetify',
        path: 'dist/vuetify.min.js',
        style: 'dist/vuetify.min.css'
    });

    return modules;
}
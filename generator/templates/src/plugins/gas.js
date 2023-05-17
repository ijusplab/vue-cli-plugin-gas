// If you use Vue v3, you can delete this file.

import Vue from 'vue';
import google from '@ijusplab/vue-cli-plugin-gas/google.mock';
import VueGasPlugin from '@ijusplab/vue-cli-plugin-gas/utils/VueGasPlugin';

Vue.use(VueGasPlugin, {
  google,
  devMode: process.env.NODE_ENV !== 'production'
});

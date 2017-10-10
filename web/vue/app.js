import 'es6-promise/auto';

import Vue from 'vue';

import store from './store/store';
import App from './components/App.vue'

const VueCookie = require('vue-cookie');
import VueClipboards from 'vue-clipboards';

Vue.use(VueClipboards);
Vue.use(VueCookie);

new Vue({
    el: '#app',
    store,
    render: h => h(App)
});

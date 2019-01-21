import Vue from 'vue';
import App from './trend-app.vue';
import store from '@/store.js';
import SvgIcon from 'vue-svgicon';
import VueSweetalert2 from 'vue-sweetalert2';

Vue.use(SvgIcon);
Vue.use(VueSweetalert2, {
  heightAuto: false
});

new Vue({
  store,
  render: (h) => h(App)
}).$mount('#app');
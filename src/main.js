import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import SvgIcon from 'vue-svgicon';
import VueSweetalert2 from 'vue-sweetalert2';

import Vuetify, {
  VApp,
  VContainer,
  VLayout,
  VFlex,
  VTextField,
  VCard,
  VCardTitle,
  VCardText,
  VIcon,
  VFadeTransition
} from 'vuetify/lib';

import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  components: {
    VApp,
    VContainer,
    VLayout,
    VFlex,
    VTextField,
    VCard,
    VCardTitle,
    VCardText,
    VIcon,
    VFadeTransition
  }
});

Vue.use(SvgIcon);
Vue.use(VueSweetalert2, {
  heightAuto: false
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
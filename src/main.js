import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
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
} from 'vuetify/lib'

import 'material-design-icons-iconfont/dist/material-design-icons.css';
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
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
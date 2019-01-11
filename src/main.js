import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify, {
  VApp,
  VContainer,
  VFlex,
  VTextField,
  VFadeTransition
} from 'vuetify/lib'

import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  components: {
    VApp,
    VContainer,
    VFlex,
    VTextField,
    VFadeTransition
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
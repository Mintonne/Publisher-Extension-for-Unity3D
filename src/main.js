import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import SvgIcon from 'vue-svgicon';
import VueSweetalert2 from 'vue-sweetalert2';
import Loader from './components/Loader.vue';

import Vuetify, {
  VApp,
  VContainer,
  VLayout,
  VFlex,
  VTextField,
  VCard,
  VCardTitle,
  VCardText,
  VSlider,
  VBtnToggle,
  VBtn,
  VIcon,
  VDivider
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
    VSlider,
    VBtnToggle,
    VBtn,
    VIcon,
    VDivider,
    Loader
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
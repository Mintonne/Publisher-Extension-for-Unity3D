import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueCarousel from 'vue-carousel';
import VueSweetalert2 from 'vue-sweetalert2';
import Loader from '@/components/Loader.vue';
import customIcons from '@/assets/icons';

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
  VSnackbar,
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
    VSnackbar,
    VDivider,
    Loader
  },
  icons: customIcons
});

Vue.use(VueCarousel);
Vue.use(VueSweetalert2, {
  heightAuto: false
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify/lib'
import VueCarousel from 'vue-carousel'
import VueSweetalert2 from 'vue-sweetalert2'
import Loader from '@/components/Loader.vue'
import customIcons from '@/assets/icons'
import './stylus/main.styl'

Vue.use(Vuetify, {
  icons: customIcons
})

Vue.use(VueCarousel)
Vue.use(VueSweetalert2, {
  heightAuto: false
})

Vue.component('Loader', Loader)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

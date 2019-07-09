import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Swal from 'sweetalert2'
import Vuetify from 'vuetify/lib'
import VueCarousel from 'vue-carousel'
import Loader from '@/components/Loader.vue'
import customIcons from '@/assets/icons'
import './stylus/main.styl'

const swalDefault = Swal.mixin({
  heightAuto: false,
  confirmButtonColor: '#1976D2',
  cancelButtonColor: '#FF5252'
})

Vue.prototype.$swal = swalDefault

Vue.use(Vuetify, {
  icons: customIcons
})

Vue.use(VueCarousel)

Vue.component('Loader', Loader)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

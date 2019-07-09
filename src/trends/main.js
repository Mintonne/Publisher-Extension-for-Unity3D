import Vue from 'vue'
import App from './App.vue'
import store from '@/store.js'
import Swal from 'sweetalert2'

const swalDefault = Swal.mixin({
  heightAuto: false,
  confirmButtonColor: '#1976D2',
  cancelButtonColor: '#FF5252'
})

Vue.prototype.$swal = swalDefault

new Vue({
  store,
  render: (h) => h(App)
}).$mount('#app')

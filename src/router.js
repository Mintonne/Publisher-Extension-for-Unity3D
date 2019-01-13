import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import Sales from '@/views/Sales.vue';
import Downloads from '@/views/Downloads.vue';
import Revenue from '@/views/Revenue.vue';
import InvoiceVerification from '@/views/InvoiceVerification.vue';
import Reviews from '@/views/Reviews.vue';
import Settings from '@/views/Settings.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: 'index.html',
  routes: [{
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/sales',
      name: 'Sales',
      component: Sales
    },
    {
      path: '/downloads',
      name: 'Downloads',
      component: Downloads
    },
    {
      path: '/revenue',
      name: 'Revenue',
      component: Revenue
    },
    {
      path: '/verify',
      name: 'Verify Invoice',
      component: InvoiceVerification
    }, ,
    {
      path: '/reviews',
      name: 'Reviews',
      component: Reviews
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})
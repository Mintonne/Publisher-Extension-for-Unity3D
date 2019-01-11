import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import Sales from '@/views/Sales.vue';
import Downloads from '@/views/Downloads.vue';
import Revenue from '@/views/Revenue.vue';
import InvoiceVerification from '@/views/InvoiceVerification.vue';
import Settings from '@/views/Settings.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: 'index.html',
  routes: [{
      path: '/',
      name: 'dashbaord',
      component: Dashboard
    },
    {
      path: '/sales',
      name: 'sales',
      component: Sales
    },
    {
      path: '/downloads',
      name: 'downloads',
      component: Downloads
    },
    {
      path: '/revenue',
      name: 'revenue',
      component: Revenue
    },
    {
      path: '/verify',
      name: 'verify',
      component: InvoiceVerification
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})
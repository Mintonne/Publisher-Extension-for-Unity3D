import Bank from 'vue-mdi/Bank.vue';
import ContentSave from 'vue-mdi/ContentSave.vue';
import Close from 'vue-mdi/Close.vue';
import CurrencyUsd from 'vue-mdi/CurrencyUsd.vue';
import Download from 'vue-mdi/Download.vue';
import Email from 'vue-mdi/Email.vue';
import MessageDraw from 'vue-mdi/MessageDraw.vue';
import MenuDown from 'vue-mdi/MenuDown.vue';
import Paypal from 'vue-mdi/Paypal.vue';
import Settings from 'vue-mdi/Settings.vue';
import ShieldCheck from 'vue-mdi/ShieldCheck.vue';
import TrendingUp from 'vue-mdi/TrendingUp.vue';
import ViewDashboard from 'vue-mdi/ViewDashboard.vue';

export default {
  bank: {
    component: Bank
  },
  clear: {
    component: Close
  },
  dashboard: {
    component: ViewDashboard
  },
  download: {
    component: Download
  },
  dropdown: {
    component: MenuDown
  },
  email: {
    component: Email
  },
  paypal: {
    component: Paypal
  },
  sales: {
    component: CurrencyUsd
  },
  save: {
    component: ContentSave
  },
  settings: {
    component: Settings
  },
  review: {
    component: MessageDraw
  },
  trending_up: {
    component: TrendingUp
  },
  verified: {
    component: ShieldCheck
  }
};
import Vue from 'vue';
import Vuex from 'vuex';
import persistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [persistedState({
    paths: ['pubId', 'pubName', 'pubRate', 'firstMonth', 'currentMonth', 'lastRefresh', 'reviewsFeed', 'interval', 'sidebarTransition']
  })],
  state: {
    timeout: 15000,
    interval: 0,
    sidebarTransition: false,

    pubId: null,
    pubName: null,
    pubRate: null,
    firstMonth: null,
    currentMonth: null,
    lastRefresh: null,
    reviewsFeed: null,

    invoiceData: null
  },
  mutations: {
    savePubInfo(state, payload) {
      state.pubId = payload.id;
      state.pubName = payload.name;
      state.pubRate = payload.rate;
    },
    saveMonthsData(state, payload) {
      state.firstMonth = payload.firstMonth;
      state.currentMonth = payload.currentMonth;
      state.lastRefresh = payload.lastRefresh;
    },
    saveReviewsFeed(state, payload) {
      state.reviewsFeed = payload;
    },
    saveSidebarStatus(state, payload) {
      state.sidebarTransition = payload;
    },
    updateInterval(state, payload) {
      state.interval = payload;
    },
    saveInvoiceData(state, payload) {
      state.invoiceData = payload;
    }
  },
  actions: {
    savePubInfo(state, payload) {
      state.commit('savePubInfo', payload);
    },
    saveMonthsData(state, payload) {
      state.commit('saveMonthsData', payload);
    },
    saveReviewsFeed(state, payload) {
      state.commit('saveReviewsFeed', payload);
    },
    saveSidebarStatus(state, payload) {
      state.commit('saveSidebarStatus', payload);
    },
    updateInterval(state, payload) {
      state.commit('updateInterval', payload);
    },
    loadPubInfo(state) {
      state.commit('loadPubInfo');
    },
    saveInvoiceData(state, payload) {
      state.commit('saveInvoiceData', payload);
    },
  },
  getters: {
    timeout: state => {
      return state.timeout;
    },
    getInterval: state => {
      return state.interval;
    },
    pubIdStatus: state => {
      return state.pubId != null;
    },
    getPubId: state => {
      return state.pubId;
    },
    getPubName: state => {
      return state.pubName;
    },
    getPubRate: state => {
      return state.pubRate;
    },
    getFirstMonth: state => {
      return state.firstMonth;
    },
    getCurrentMonth: state => {
      return state.currentMonth;
    },
    getLastRefresh: state => {
      return state.lastRefresh;
    },
    getReviewsFeed: state => {
      return state.reviewsFeed;
    },
    getSidebarStatus: state => {
      return state.sidebarTransition;
    },
    getInvoiceData: state => {
      return state.invoiceData;
    }
  }
});
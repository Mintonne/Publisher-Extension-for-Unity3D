import Vue from 'vue';
import Vuex from 'vuex';
import {
  pubIDKey,
  pubNameKey,
  payoutRateKey,
  firstMonthsKey,
  currentMonthsKey,
  lastRefreshKey,
  reviewsFeedKey,
  sidebarTransitionKey,
  updateFrequencyKey
} from '@/constants/keys';

Vue.use(Vuex);

export default new Vuex.Store({
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
      localStorage[pubIDKey] = state.pubId = payload.id;
      localStorage[pubNameKey] = state.pubName = payload.name;
      localStorage[payoutRateKey] = state.pubRate = payload.rate;
    },
    saveMonthsData(state, payload) {
      localStorage[firstMonthsKey] = state.firstMonth = payload.firstMonth;
      localStorage[currentMonthsKey] = state.currentMonth = payload.currentMonth;
      localStorage[lastRefreshKey] = state.lastRefresh = payload.lastRefresh;
    },
    saveReviewsFeed(state, payload) {
      localStorage[reviewsFeedKey] = state.reviewsFeed = payload;
    },
    saveSidebarStatus(state, payload) {
      localStorage[sidebarTransitionKey] = state.sidebarTransition = payload;
    },
    updateInterval(state, payload) {
      localStorage[updateFrequencyKey] = state.interval = payload;
    },
    loadPubInfo(state) {
      state.interval = Number(localStorage[updateFrequencyKey]) || 0;

      state.pubId = Number(localStorage[pubIDKey]) || null;
      state.pubName = localStorage[pubNameKey] || null;
      state.pubRate = Number(localStorage[payoutRateKey]) || null;

      state.firstMonth = localStorage[firstMonthsKey] || null;
      state.currentMonth = localStorage[currentMonthsKey] || null;
      state.lastRefresh = Number(localStorage[lastRefreshKey]) || null;

      state.reviewsFeed = localStorage[reviewsFeedKey] || null;

      state.sidebarTransition = localStorage[sidebarTransitionKey] === 'true';
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
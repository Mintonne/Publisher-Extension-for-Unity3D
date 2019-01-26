import Vue from 'vue';
import Vuex from 'vuex';
import persistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [persistedState()],
  state: {
    interval: 0,
    sidebarTransition: false,

    pubId: null,
    pubName: null,
    pubRate: null,
    firstMonth: null,
    currentMonth: null,
    lastRefresh: null,
    reviewsFeed: null,

    sortOrder: 5
  },
  mutations: {
    updateInterval(state, payload) {
      state.interval = payload;
    },
    saveSidebarStatus(state, payload) {
      state.sidebarTransition = payload;
    },
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
    saveSortOrder(state, payload) {
      state.sortOrder = payload;
    }
  },
  actions: {
    updateInterval(state, payload) {
      state.commit('updateInterval', payload);
    },
    saveSidebarStatus(state, payload) {
      state.commit('saveSidebarStatus', payload);
    },
    savePubInfo(state, payload) {
      state.commit('savePubInfo', payload);
    },
    saveMonthsData(state, payload) {
      state.commit('saveMonthsData', payload);
    },
    saveReviewsFeed(state, payload) {
      state.commit('saveReviewsFeed', payload);
    },
    saveSortOrder(state, payload) {
      state.commit('saveSortOrder', payload);
    }
  },
  getters: {
    getInterval: state => {
      return state.interval;
    },
    getSidebarStatus: state => {
      return state.sidebarTransition;
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
    getSortOrder: state => {
      return state.sortOrder;
    }
  }
});
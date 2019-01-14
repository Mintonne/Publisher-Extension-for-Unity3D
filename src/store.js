import Vue from 'vue';
import Vuex from 'vuex';
import {
  pubIDKey,
  pubNameKey,
  payoutRateKey,
  firstMonthsKey,
  currentMonthsKey,
  lastRefreshKey
} from '@/constants/keys';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pubId: null,
    pubName: null,
    pubRate: null,
    firstMonth: null,
    currentMonth: null,
    lastRefresh: null
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
    loadPubInfo(state) {
      state.pubId = localStorage[pubIDKey] || null;
      state.pubName = localStorage[pubNameKey] || null;
      state.pubRate = localStorage[payoutRateKey] || null;
      state.firstMonth = localStorage[firstMonthsKey] || null;
      state.currentMonth = localStorage[currentMonthsKey] || null;
      state.lastRefresh = localStorage[lastRefreshKey] || null;
    }
  },
  actions: {
    savePubInfo(state, payload) {
      state.commit('savePubInfo', payload);
    },
    saveMonthsData(state, payload) {
      state.commit('saveMonthsData', payload);
    },
    loadPubInfo(state) {
      state.commit('loadPubInfo');
    }
  },
  getters: {
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
    }
  }
});
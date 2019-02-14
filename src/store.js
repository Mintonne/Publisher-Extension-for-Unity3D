import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [persistedState()],
  state: {
    interval: 0,
    sidebarTransition: false,
    salesTooltip: false,

    pubId: null,
    pubName: null,
    pubRate: null,
    firstMonth: null,
    currentMonth: null,
    lastRefresh: null,
    reviewsFeed: null,

    salesSortOrder: 5,
    downloadsSortOrder: 1
  },
  mutations: {
    updateInterval (state, payload) {
      state.interval = payload
    },
    saveSidebarStatus (state, payload) {
      state.sidebarTransition = payload
    },
    saveTooltipStatus (state, payload) {
      state.salesTooltip = payload
    },
    savePubInfo (state, payload) {
      state.pubId = payload.id
      state.pubName = payload.name
      state.pubRate = payload.rate
    },
    saveMonthsData (state, payload) {
      state.firstMonth = payload.firstMonth
      state.currentMonth = payload.currentMonth
      state.lastRefresh = payload.lastRefresh
    },
    saveReviewsFeed (state, payload) {
      state.reviewsFeed = payload
    },
    saveSalesSortOrder (state, payload) {
      state.salesSortOrder = payload
    },
    saveDownloadsSortOrder (state, payload) {
      state.downloadsSortOrder = payload
    }
  },
  actions: {
    updateInterval (state, payload) {
      state.commit('updateInterval', payload)
    },
    saveSidebarStatus (state, payload) {
      state.commit('saveSidebarStatus', payload)
    },
    saveTooltipStatus (state, payload) {
      state.commit('saveTooltipStatus', payload)
    },
    savePubInfo (state, payload) {
      state.commit('savePubInfo', payload)
    },
    saveMonthsData (state, payload) {
      state.commit('saveMonthsData', payload)
    },
    saveReviewsFeed (state, payload) {
      state.commit('saveReviewsFeed', payload)
    },
    saveSalesSortOrder (state, payload) {
      state.commit('saveSalesSortOrder', payload)
    },
    saveDownloadsSortOrder (state, payload) {
      state.commit('saveDownloadsSortOrder', payload)
    }
  },
  getters: {
    getInterval: state => {
      return state.interval
    },
    getSidebarStatus: state => {
      return state.sidebarTransition
    },
    getTooltipStatus: state => {
      return state.salesTooltip
    },
    pubIdStatus: state => {
      return state.pubId != null
    },
    getPubId: state => {
      return state.pubId
    },
    getPubName: state => {
      return state.pubName
    },
    getPubRate: state => {
      return state.pubRate
    },
    getFirstMonth: state => {
      return state.firstMonth
    },
    getCurrentMonth: state => {
      return state.currentMonth
    },
    getLastRefresh: state => {
      return state.lastRefresh
    },
    getReviewsFeed: state => {
      return state.reviewsFeed
    },
    getSalesSortOrder: state => {
      return state.salesSortOrder
    },
    getDownloadsSortOrder: state => {
      return state.downloadsSortOrder
    }
  }
})

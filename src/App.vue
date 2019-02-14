<template>
  <div
    id="app"
    data-app="true">
    <loader
      v-if="loading"
      class="fill"
      :message="loadingMessage" />
    <sidebar />
    <keep-alive exclude="['Dashboard', 'Settings']">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import Api from '@/api'
import Sidebar from '@/components/Sidebar.vue'
import { SharedMethods } from '@/mixins'
import {
  popupWindowHeightKey,
  popupWindowWidthKey,
  popupWindowTopPosKey,
  popupWindowLeftPosKey
} from '@/constants/keys'

export default {
  components: {
    Sidebar
  },
  mixins: [SharedMethods],
  data () {
    return {
      loading: false,
      loadingMessage: 'Refreshing months data'
    }
  },
  created () {
    this.LoginStatus()
  },
  beforeMount () {
    const windowURL = new URL(window.location.href)

    if (windowURL.searchParams.has('inv')) {
      sessionStorage.setItem(
        'selectedInvoice',
        windowURL.searchParams.get('inv')
      )
      this.$router.push('verify')
    }

    if (windowURL.searchParams.has('resize')) {
      window.addEventListener('resize', () => {
        localStorage[popupWindowHeightKey] = window.outerHeight
        localStorage[popupWindowWidthKey] = window.outerWidth
        localStorage[popupWindowTopPosKey] = window.screenTop
        localStorage[popupWindowLeftPosKey] = window.screenLeft
      })
    }
  },
  mounted () {
    if (
      this.$store.getters.getCurrentMonth == null ||
      this.$store.getters.getLastRefresh == null
    ) { return }

    let preDate = new Date(this.$store.getters.getCurrentMonth)
    let curDate = new Date()

    if (
      (preDate.getMonth() < curDate.getMonth() ||
        preDate.getFullYear() < curDate.getFullYear()) &&
      curDate.getTime() - this.$store.getters.getLastRefresh >= 3600000
    ) { this.CacheMonthsData() }
  },
  methods: {
    CacheMonthsData () {
      let id = this.$store.getters.getPubId
      let endpoint = `/publisher-info/months/${id}.json`

      this.loading = true

      Api.get(endpoint)
        .then(response => {
          let data = response.data

          let firstMonth = this.InsertCharacter(data.periods[data.periods.length - 1].value, 4, '-')
          let currentMonth = this.InsertCharacter(
            data.periods[0].value,
            4,
            '-'
          )
          let lastRefresh = Date.now()

          this.$store.dispatch('saveMonthsData', {
            firstMonth,
            currentMonth,
            lastRefresh
          })

          this.SendMessage('restart')
        })
        .catch(error => {
          console.log(error)
          this.RequestError()
        })
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
}

html,
body {
  width: 800px;
  height: 580px;
}

html {
  /* width */
  ::-webkit-scrollbar {
    width: 11px;
    height: 14px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #c9c9c9;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  overflow-y: auto !important;
}

body {
  overflow: auto;
  background-color: #fcfcfc;

  > #app {
    width: 100%;
    height: 100%;

    .section {
      width: 740px;
      height: 100%;
      margin-left: 60px;
      overflow: hidden;

      > *:not(.fill) {
        width: 85%;
        margin: 0 auto;
      }
    }
  }
}

.svg-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  color: inherit;
  vertical-align: middle;
  fill: none;
  stroke: currentColor;

  &.svg-fill {
    fill: currentColor;
    stroke: none;
  }
}
</style>

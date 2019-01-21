<template>
  <div data-app="true" id="app">
    <loader class="fill" v-if="loading" :message="loadingMessage"></loader>
    <sidebar />
    <router-view />
  </div>
</template>

<script>
import Api from '@/api';
import Sidebar from '@/components/TheSidebar.vue';
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  data() {
    return {
      loading: false,
      loadingMessage: 'Refreshing months data'
    }
  },
  created() {
    this.LoginStatus();
  },
  mounted() {
    if (this.$store.getters.getCurrentMonth == null || this.$store.getters.getLastRefresh == null)
      return;

    let preDate = new Date(this.$store.getters.getCurrentMonth);
    let curDate = new Date();

    if ((preDate.getMonth() < curDate.getMonth() || preDate.getFullYear() < curDate.getFullYear()) && curDate.getTime() - this.$store.getters.getLastRefresh >= 3600000)
      this.CacheMonthsData();
  },
  methods: {
    CacheMonthsData() {
      let id = this.$store.getters.getPubId;
      let endpoint = `/publisher-info/months/${id}.json`;

      this.loading = true;

      Api.get(endpoint)
        .then((response) => {
          let data = response.data;

          let firstMonth = this.InsertCharacter(data.periods[data.periods.length - 1].value, 4, '-');
          let currentMonth = this.InsertCharacter(data.periods[0].value, 4, '-');
          let lastRefresh = Date.now();

          this.$store.dispatch('saveMonthsData', { firstMonth, currentMonth, lastRefresh });

          this.SendMessage('restart');
        })
        .catch((error) => {
          console.log(error);
          this.RequestError();
        })
        .then(() => {
          this.loading = false;
        });
    }
  },
  components: {
    Sidebar
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
  font-size: 16px;
}

html,
body {
  width: 800px;
  height: 580px;
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

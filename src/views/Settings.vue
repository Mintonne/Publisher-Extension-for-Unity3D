<template>
  <div class="section pb-3">
    <loader
      v-if="loading"
      class="fill"
      :message="loadingMessage" />

    <nav-bar title="Settings" />

    <div>
      <p>Publisher ID</p>
      <v-layout>
        <v-flex xs10>
          <v-text-field
            hide-details
            readonly
            solo
            placeholder="Publisher ID"
            :value="pubId" />
        </v-flex>

        <v-flex xs2>
          <v-btn
            id="fetchBtn"
            block
            large
            class=" my-0"
            @click="GetPublisherInfo">
            <span class="text-none">Fetch Info</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </div>

    <v-divider class="my-4" />

    <div>
      <p>Sales Update Frequency</p>
      <v-flex xs12>
        <v-slider
          v-model="interval"
          hide-details
          color="#339af0"
          thumb-label="always"
          step="5"
          max="60"
          class="mt-5" />
      </v-flex>
      <p class="text-xs-center body-1">
        Time in Minutes
      </p>
    </div>

    <v-divider class="my-4" />

    <div>
      <p>Sales Tooltip</p>
      <v-flex xs12>
        <v-btn-toggle
          v-model="tooltipStatus"
          mandatory>
          <v-btn
            large
            :value="true">
            <span>On</span>
          </v-btn>
          <v-btn
            large
            :value="false">
            <span>Off</span>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
    </div>

    <v-divider class="my-4" />

    <div>
      <p>Sidebar Transition</p>
      <v-flex xs12>
        <v-btn-toggle
          v-model="sidebarStatus"
          mandatory>
          <v-btn
            large
            :value="true">
            <span>On</span>
          </v-btn>
          <v-btn
            large
            :value="false">
            <span>Off</span>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
    </div>
  </div>
</template>

<script>
import Api from '@/api'
import NavBar from '@/components/Navbar.vue'
import { SharedMethods } from '@/mixins'

export default {
  components: {
    NavBar
  },
  mixins: [SharedMethods],
  data () {
    return {
      loading: false,
      loadingMessage: null
    }
  },
  computed: {
    pubId () {
      return this.$store.getters.getPubId
    },
    interval: {
      get: function () {
        return this.$store.getters.getInterval
      },
      set: function (newValue) {
        this.$store.dispatch('updateInterval', newValue)
        this.SendMessage('restart')
      }
    },
    sidebarStatus: {
      get: function () {
        return this.$store.getters.getSidebarStatus
      },
      set: function (newValue) {
        this.$store.dispatch('saveSidebarStatus', newValue)
      }
    },
    tooltipStatus: {
      get: function () {
        return this.$store.getters.getTooltipStatus
      },
      set: function (newValue) {
        this.$store.dispatch('saveTooltipStatus', newValue)
      }
    }
  },
  methods: {
    GetPublisherInfo () {
      chrome.storage.local.clear()
      localStorage.clear()

      let endpoint = '/publisher/overview.json'

      this.loading = true
      this.loadingMessage = 'Fetching your publisher information'

      Api.get(endpoint)
        .then((response) => {
          let data = response.data.overview

          this.$store.dispatch('savePubInfo', { id: data.id, name: data.name, rate: data.payout_cut })

          this.CacheMonthsData()
        })
        .catch((error) => {
          console.log(error)
          this.RequestError()
          this.loading = false
        })
    },
    CacheMonthsData () {
      let id = this.$store.getters.getPubId
      let endpoint = `/publisher-info/months/${id}.json`

      this.loadingMessage = 'Fetching months data'

      Api.get(endpoint)
        .then((response) => {
          let data = response.data

          let firstMonth = this.InsertCharacter(data.periods[data.periods.length - 1].value, 4, '-')
          let currentMonth = this.InsertCharacter(data.periods[0].value, 4, '-')
          let lastRefresh = Date.now()

          this.$store.dispatch('saveMonthsData', { firstMonth, currentMonth, lastRefresh })

          this.SendMessage('restart')

          this.GetReviewsLink()
        })
        .catch((error) => {
          console.log(error)
          this.RequestError()
        })
        .then(() => {
          this.loading = false
        })
    },
    GetReviewsLink () {
      this.$swal({
        title: 'Get Reviews Link?',
        text: 'Do you want the extension to retrieve and save your reviews feed link?',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Get Reviews Link',
        cancelButtonText: 'Skip',
        allowEnterKey: false
      }).then((result) => {
        if (result.value) {
          let id = this.$store.getters.getPubId
          let endpoint = `/management/publisher/info/${id}.json`

          this.loading = true
          this.loadingMessage = 'Fetching Reviews Link'

          Api.get(endpoint)
            .then((response) => {
              let data = response.data

              let link = this.ConvertToSecure(data.result.publisher.activity_url)

              this.$store.dispatch('saveReviewsFeed', link)

              this.SendMessage('restart')
            })
            .catch((error) => {
              console.log(error)
              this.RequestError()
            })
            .then(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.section {
  overflow-y: auto !important;
}

#fetchBtn {
  height: 48px;
  margin-left: -1px;
  background-color: white;
  color: $primary-color;

  &:hover {
    background-color: $primary-color;
    color: white;
  }
}

.v-btn-toggle {
  width: 100%;

  .v-btn:not(.v-btn--icon):not(.v-btn--flat) {
    width: calc(100% / 2);
    background-color: white;
    color: $primary-color;
    opacity: 1;

    &.v-btn--active {
      background-color: $primary-color;

      span {
        color: white;
      }
    }
  }
}
</style>

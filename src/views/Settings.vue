<template>
  <div class="section">
    <loader class="fill" v-if="loading" :message="loadingMessage"></loader>

    <nav-bar title="Settings"></nav-bar>

    <div>
      <h2 class="subheading mb-3">Publisher ID</h2>
      <v-layout>
        <v-flex xs10>
          <v-text-field hide-details readonly solo Placeholder="Publisher ID" :value="pubId"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-btn block large
            id="fetchBtn"
            class=" my-0"
            @click="GetPublisherInfo">
            <span class="text-none">Fetch Info</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </div>

    <v-divider class="my-4"></v-divider>

    <div>
      <h2 class="subheading mb-3">Sales Update Frequency</h2>
      <v-flex xs12>
        <v-slider
          hide-details
          color="#339af0"
          v-model="interval"
          thumb-label="always"
          step="5"
          max="60"
          class="mt-5">
        </v-slider>
      </v-flex>
      <p class="text-xs-center body-1">Time in Minutes</p>
    </div>

    <v-divider class="my-4"></v-divider>

    <div>
      <h2 class="subheading mb-3">Sidebar Transition</h2>
      <v-flex xs12>
        <v-btn-toggle mandatory v-model="sidebarStatus" ID="sidebar-btn-group">
          <v-btn large :value="true">
            <span>On</span>
          </v-btn>
          <v-btn large :value="false">
            <span>Off</span>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import NavBar from "@/components/TheNavBar.vue";
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  data() {
    return {
      loading: false,
      loadingMessage: null
    }
  },
  computed: {
    pubId() {
      return this.$store.getters.getPubId;
    },
    interval: {
      get: function () {
        return this.$store.getters.getInterval;
      },
      set: function (newValue) {
        this.$store.dispatch('updateInterval', newValue);
        this.SendMessage('restart');
      }
    },
    sidebarStatus: {
      get: function () {
        return this.$store.getters.getSidebarStatus;
      },
      set: function (newValue) {
        this.$store.dispatch('saveSidebarStatus', newValue);
      }
    }
  },
  methods: {
    GetPublisherInfo() {
      let endpoint = 'https://publisher.assetstore.unity3d.com/api/publisher/overview.json';

      this.loading = true;
      this.loadingMessage = 'Fetching your publisher information';

      axios.get(endpoint, {
        timeout: this.$store.getters.timeout
      })
        .then((response) => {
          let data = response.data.overview;

          this.$store.dispatch('savePubInfo', { id: data.id, name: data.name, rate: data.payout_cut });

          this.CacheMonthsData();
        })
        .catch((error) => {
          console.log(error);
          this.RequestError();
          this.loading = false;
        })
    },
    CacheMonthsData() {
      let id = this.$store.getters.getPubId;
      let endpoint = `https://publisher.assetstore.unity3d.com/api/publisher-info/months/${id}.json`;

      this.loadingMessage = 'Fetching months data';

      axios.get(endpoint, {
        timeout: this.$store.getters.timeout
      })
        .then((response) => {
          let data = response.data;

          let firstMonth = this.InsertCharacter(data.periods[data.periods.length - 1].value, 4, '-');
          let currentMonth = this.InsertCharacter(data.periods[0].value, 4, '-');
          let lastRefresh = Date.now();

          this.$store.dispatch('saveMonthsData', { firstMonth, currentMonth, lastRefresh });

          this.GetReviewsLink();
        })
        .catch((error) => {
          console.log(error);
          this.RequestError();
        })
        .then(() => {
          this.loading = false;
        });
    },
    GetReviewsLink() {
      this.$swal({
        title: "Get Reviews Link?",
        text: 'Do you want the extension to retrieve and save your reviews feed link?',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Get Reviews Link',
        cancelButtonText: 'Skip',
        allowEnterKey: false,
      }).then((result) => {
        if (result.value) {
          let id = this.$store.getters.getPubId;
          let endpoint = `https://publisher.assetstore.unity3d.com/api/management/publisher/info/${id}.json`;

          this.loading = true;
          this.loadingMessage = 'Fetching Reviews Link';

          axios.get(endpoint, {
            timeout: this.$store.getters.timeout
          })
            .then((response) => {
              let data = response.data;

              let link = this.ConvertToSecure(data.result.publisher.activity_url);

              this.$store.dispatch('saveReviewsFeed', link);

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
      });
    }
  },
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

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

#sidebar-btn-group {
  width: 100%;

  .v-btn {
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
<template>
  <div class="section">
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
            @click="getPublisherInfo">
            <span> Fetch ID </span>
          </v-btn>
        </v-flex>
      </v-layout>
    </div>

    <v-divider class="my-4"></v-divider>
    <loader class="fill" v-if="loading" :message="loadingMessage"></loader>
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
  methods: {
    getPublisherInfo() {
      let myInstance = this;
      let endpoint = 'https://publisher.assetstore.unity3d.com/api/publisher/overview.json';

      this.loading = true;
      this.loadingMessage = 'Fetching your publisher information';

      axios.get(endpoint)
        .then((response) => {
          let data = response.data.overview;

          myInstance.$store.dispatch('savePubInfo', { id: data.id, name: data.name, rate: data.payout_cut });

          myInstance.CacheMonthsData();
        })
        .catch((error) => {
          console.log(error);
          myInstance.loading = false;
        })
    },
    CacheMonthsData() {
      let myInstance = this;
      let id = this.$store.getters.getPubId;

      let endpoint = `https://publisher.assetstore.unity3d.com/api/publisher-info/months/${id}.json`;

      this.loadingMessage = 'Fetching months data';

      axios.get(endpoint)
        .then((response) => {
          let data = response.data;

          let firstMonth = myInstance.InsertCharacter(data.periods[data.periods.length - 1].value, 4, '-');
          let currentMonth = myInstance.InsertCharacter(data.periods[0].value, 4, '-');
          let lastRefresh = Date.now();

          myInstance.$store.dispatch('saveMonthsData', { firstMonth, currentMonth, lastRefresh });
        })
        .catch((error) => {
          console.log(error);
          myInstance.loading = false;
        })
        .then(() => {
          myInstance.$store.dispatch('loadPubInfo');
          myInstance.loading = false;
        });
    }
  },
  computed: {
    pubId() {
      return this.$store.getters.getPubId;
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
  background-color: $primary-color;
  color: $white;
}
</style>
<template>
  <div class="section">
    <loader class="fill" v-if="loading" :message="loadingMessage"></loader>

    <nav-bar title="Verify Invoice"></nav-bar>

    <v-layout>
      <v-flex xs10>
        <v-text-field
          hide-details
          solo
          Placeholder="Invoice Number"
          :readonly="loading"
          v-model="invoiceNumber">
        </v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-btn block large
          id="verifyBtn"
          class=" my-0"
          @click="GetInvoiceInfo">
          <span class="text-none">Verify</span>
        </v-btn>
      </v-flex>
    </v-layout>

    <div id="invoice-results" class="mt-5 text-xs-center" v-if="invoiceData != null">
      <p class="display-1">{{ invoiceData[1] }}</p>
      <p class="mb-1 font-weight-bold">Purchased On</p>
      <p>{{ FormatDate(invoiceData[4]) }}</p>
      <p class="mb-1 font-weight-bold">Price (Excluding VAT)</p>
      <p>{{ invoiceData[3] }}</p>
      <p class="mb-1 font-weight-bold">Quantity</p>
      <p>{{ invoiceData[2] }} License(s)</p>
      <p class="mb-1 font-weight-bold">Status</p>
      <p>{{ invoiceData[5] }}</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import NavBar from "@/components/TheNavBar.vue";
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  created() {
    if (!this.$store.getters.pubIdStatus)
      this.RedirectToSettings(this.$router);

    this.invoiceData = this.$store.getters.getInvoiceData || null;
  },
  data() {
    return {
      invoiceNumber: null,
      invoiceData: null,
      loading: false,
      loadingMessage: 'Fetching invoice data'
    }
  },
  watch: {
    invoiceData() {
      this.$store.dispatch('saveInvoiceData', this.invoiceData);
    }
  },
  methods: {
    GetInvoiceInfo() {
      let id = this.$store.getters.getPubId;
      let endpoint = `https://publisher.assetstore.unity3d.com/api/publisher-info/verify-invoice/${id}/${this.invoiceNumber}.json`;

      this.loading = true;

      axios.get(endpoint.trim(), {
        timeout: this.$store.getters.timeout
      })
        .then((response) => {
          let data = response.data.aaData;

          if (data == null || data.length <= 0) {
            this.invoiceData = null;
            this.$swal('Error', 'No record found', 'error');
          }
          else {
            this.invoiceData = data[0];
          }
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
    NavBar
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

#verifyBtn {
  height: 48px;
  margin-left: -1px;
  background-color: white;
  color: $primary-color;

  &:hover {
    background-color: $primary-color;
    color: white;
  }
}
</style>
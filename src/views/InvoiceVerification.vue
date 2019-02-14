<template>
  <div class="section">
    <loader
      v-if="loading"
      class="fill"
      :message="loadingMessage" />

    <nav-bar title="Verify Invoice" />

    <v-layout>
      <v-flex xs10>
        <v-text-field
          v-model="invoiceNumber"
          hide-details
          solo
          placeholder="Invoice Number"
          :readonly="loading"
          @keyup.enter="GetInvoiceData" />
      </v-flex>
      <v-flex xs2>
        <v-btn
          id="verifyBtn"
          block
          large
          class=" my-0"
          @click="GetInvoiceData">
          <span class="text-none">Verify</span>
        </v-btn>
      </v-flex>
    </v-layout>

    <div
      v-if="invoiceData != null"
      id="invoice-results"
      class="mt-5 text-xs-center">
      <p class="display-1">
        {{ invoiceData[1] }}
      </p>
      <p class="mb-2 font-weight-medium">
        Purchased On
      </p>
      <p>{{ FormatDate(invoiceData[4]) }}</p>
      <p class="mb-2 font-weight-medium">
        Price (Excluding VAT)
      </p>
      <p>{{ invoiceData[3] }}</p>
      <p class="mb-2 font-weight-medium">
        Quantity
      </p>
      <p>{{ invoiceData[2] }} License(s)</p>
      <p class="mb-2 font-weight-medium">
        Status
      </p>
      <p>{{ invoiceData[5] }}</p>
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
      invoiceNumber: sessionStorage.getItem('selectedInvoice') || null,
      invoiceData: null,
      loading: false,
      loadingMessage: 'Fetching invoice data'
    }
  },
  activated () {
    if (!this.$store.getters.pubIdStatus) { return this.RedirectToSettings(this.$router) }
  },
  methods: {
    GetInvoiceData () {
      if (this.loading) { return }

      if (this.invoiceNumber == null || this.invoiceNumber.length <= 5) {
        return this.$swal('Invalid Invoice', 'The invoice number entered is too short', 'error')
      }

      let id = this.$store.getters.getPubId
      let endpoint = `/publisher-info/verify-invoice/${id}/${this.invoiceNumber}.json`

      this.loading = true

      Api.get(endpoint.trim())
        .then((response) => {
          let data = response.data.aaData

          if (data == null || data.length <= 0) {
            this.invoiceData = null
            this.$swal('Error', 'No record found', 'error')
          } else {
            this.invoiceData = data[0]
          }
        })
        .catch((error) => {
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

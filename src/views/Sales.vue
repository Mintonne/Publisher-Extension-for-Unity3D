<template>
  <div class="section pb-3">
    <loader
      v-if="loading"
      class="fill"
      :message="loadingMessage" />

    <nav-bar :title="navbarTitle" />

    <v-layout>
      <v-flex xs10>
        <v-text-field
          v-model="searchTerm"
          label="Search for package"
          solo
          single-line />
      </v-flex>
      <v-flex xs2>
        <v-menu
          v-model="showPicker"
          :close-on-content-click="false"
          left
          full-width
          transition="slide-x-transition"
          offset-y>
          <v-btn
            id="pickerBtn"
            slot="activator"
            block
            large
            class=" my-0">
            <v-icon>$vuetify.icons.calendar</v-icon>
          </v-btn>

          <v-date-picker
            v-model="salesPeriod"
            color="#339af0"
            :min="minDate"
            :max="maxDate"
            type="month"
            :show-current="salesPeriod"
            width="250"
            no-title
            scrollable
            @input="changeMonth" />
        </v-menu>
      </v-flex>
    </v-layout>

    <info-carousel v-if="salesData != null && salesData.length > 0">
      <slide>
        <info-tile
          title="Net Revenue"
          :text="netRevenue.toFixed(2)" />
      </slide>
      <slide>
        <info-tile
          title="Total Sales"
          prefix=""
          :text="totalSales"
          color="#17a2b8" />
      </slide>
      <slide>
        <info-tile
          title="Refunds"
          prefix=""
          :text="totalRefunds"
          color="#EE2B4B" />
      </slide>
      <slide>
        <info-tile
          title="Commission"
          :text="totalCommission.toFixed(2)" />
      </slide>
      <slide>
        <info-tile
          title="Vouchers"
          prefix=""
          :text="totalVouchers"
          color="#17a2b8" />
      </slide>
      <slide>
        <info-tile
          title="Chargebacks"
          prefix=""
          :text="totalChargebacks"
          color="#EE2B4B" />
      </slide>
    </info-carousel>

    <v-layout
      v-if="salesData != null && salesData.length > 0"
      class="px-1">
      <v-btn
        class="mx-0 text-none"
        disabled
        flat>
        Packages ({{ sortOptions[currentSortOrder] }})
      </v-btn>
      <v-spacer />
      <v-menu
        left
        offset-x>
        <v-btn
          slot="activator"
          class="mx-0 px-2 text-none"
          flat>
          Sort by
          <v-icon
            class="ml-1"
            right>
            $vuetify.icons.dropdown
          </v-icon>
        </v-btn>

        <v-list
          dense
          class="pa-0">
          <v-list-tile
            v-for="(option, index) in sortOptions"
            :key="index"
            @click="ChangeSortOrder(index)">
            <v-list-tile-title :class="{'selected-option' : index == currentSortOrder}">
              {{ option }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu
        left
        offset-x>
        <v-btn
          slot="activator"
          class="mx-0 px-2 text-none"
          flat>
          Order
          <v-icon
            class="ml-1"
            right>
            $vuetify.icons.dropdown
          </v-icon>
        </v-btn>

        <v-list
          dense
          class="pa-0">
          <v-list-tile
            v-for="(option, index) in orderOptions"
            :key="index"
            @click="ChangeOrder(index)">
            <v-list-tile-title :class="{'selected-option' : index == currentOrder}">
              {{ option }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-layout>

    <v-layout
      v-if="salesData != null && salesData.length > 0"
      row
      wrap>
      <package-tile
        v-for="(item, index) in packagesData"
        :key="index"
        :package-data="item"
        :term="searchTerm" />
    </v-layout>

    <snackbar
      :value="showSnackbar"
      :callback="GetSalesData"
      timeout="5000" />
  </div>
</template>

<script>
import Api from '@/api'
import NavBar from '@/components/Navbar.vue'
import InfoCarousel from '@/components/InfoCarousel.vue'
import InfoTile from '@/components/InfoTile.vue'
import PackageTile from '@/components/PackageTile.vue'
import Snackbar from '@/components/Snackbar.vue'
import { SharedMethods } from '@/mixins'

export default {
  components: {
    NavBar,
    InfoCarousel,
    InfoTile,
    PackageTile,
    Snackbar
  },
  mixins: [SharedMethods],
  data () {
    return {
      navbarTitle: 'Sales',
      searchTerm: '',
      showPicker: false,
      minDate: this.$store.getters.getFirstMonth,
      maxDate: new Date().toISOString().substr(0, 10),
      sortOptions: ['Name', 'Price', 'Quantity', 'Refunds', 'Chargebacks', 'Revenue', 'First Sale Date', 'Last Sale Date'],
      orderOptions: ['Ascending (A - Z)', 'Descending (Z - A)'],
      currentSortOrder: this.$store.getters.getSalesSortOrder,
      currentOrder: 1,
      salesData: null,
      packagesData: [],
      salesPeriod: null,
      netRevenue: 0,
      totalSales: 0,
      totalRefunds: 0,
      totalCommission: 0,
      totalVouchers: 0,
      totalChargebacks: 0,
      showSnackbar: false,
      loading: false,
      loadingMessage: 'Fetching sales data'
    }
  },
  activated () {
    if (!this.$store.getters.pubIdStatus) { return this.RedirectToSettings(this.$router) }

    if (this.salesPeriod == null) { this.salesPeriod = this.$store.getters.getCurrentMonth }

    if (this.salesData == null) { this.GetSalesData() }
  },
  methods: {
    changeMonth () {
      this.showPicker = false
      this.GetSalesData()
    },
    GetSalesData () {
      let id = this.$store.getters.getPubId

      let endpoint = `/publisher-info/sales/${id}/${this.salesPeriod.replace(/-/g, '')}.json`

      this.loading = true
      this.showSnackbar = false

      Api.get(endpoint.trim())
        .then((response) => {
          let data = response.data.aaData

          this.navbarTitle = new Date(this.salesPeriod).toLocaleString(navigator.language, {
            month: 'long',
            year: 'numeric'
          })

          this.salesData = data

          if (data == null) {
            return this.$swal.fire('Error', 'No records found', 'error')
          }

          this.PopulateSalesData(data)
        })
        .catch((error) => {
          console.log(error)
          this.showSnackbar = true
        })
        .then(() => {
          this.loading = false
        })
    },
    PopulateSalesData (data) {
      if (data.length <= 0) { return }

      let grossRevenue = 0

      this.packagesData.splice(0, this.packagesData.length)

      this.totalVouchers = 0
      this.totalSales = 0
      this.totalRefunds = 0
      this.totalChargebacks = 0

      data.forEach(item => {
        this.packagesData.push(item)

        let gross = Number(item[5].replace(/\$/g, ''))
        let qty = Number(item[2])

        if (gross === 0) { this.totalVouchers += qty }

        grossRevenue += gross
        this.totalSales += qty
        this.totalRefunds += Number(item[3])
        this.totalChargebacks += Number(item[4])
      })

      let payoutRate = this.$store.getters.getPubRate || 0.7
      payoutRate = Number(payoutRate)

      this.netRevenue = grossRevenue * payoutRate
      this.totalCommission = grossRevenue * (1 - payoutRate)

      this.searchTerm = ''
      this.SortPackages()
    },
    ChangeSortOrder (index) {
      this.$store.dispatch('saveSalesSortOrder', index)
      this.currentSortOrder = index

      this.SortPackages()
    },
    ChangeOrder (index) {
      this.currentOrder = index
      this.ChangeSortOrder(Number(this.$store.getters.getSalesSortOrder))

      this.SortPackages()
    },
    SortPackages () {
      let index = this.currentSortOrder
      let desc = this.currentOrder === 0

      this.packagesData.sort((a, b) => {
        let x, y

        x = Number(a[index].replace(/\$/g, ''))
        y = Number(b[index].replace(/\$/g, ''))

        x = isNaN(x) ? a[index].toUpperCase() : x
        y = isNaN(y) ? b[index].toUpperCase() : y

        if (desc) {
          if (x > y) {
            return 1
          }
          if (x < y) {
            return -1
          }
          return 0
        } else {
          if (x > y) {
            return -1
          }
          if (y > x) {
            return 1
          }
          return 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  overflow-y: auto !important;
}

.selected-option {
  color: $primary-color;
  font-weight: 500;
}

.v-btn.v-btn--disabled {
  color: rgba(0, 0, 0, 0.5) !important;
}

#pickerBtn {
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

<template>
  <div class="section">
    <loader class="fill" v-if="loading" :message="loadingMessage"></loader>

    <nav-bar :title="navbarTitle"></nav-bar>

    <v-layout>
      <v-flex xs10>
        <v-text-field v-model="searchTerm" label="Search for package" solo single-line>
        </v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-btn block large
          id="pickerBtn"
          class=" my-0"
          @click="GetInvoiceData">
          <v-icon>$vuetify.icons.calendar</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <info-carousel v-if="salesData != null">
      <slide>
        <info-tile title="Net Revenue" :text="netRevenue.toFixed(2)" />
      </slide>
      <slide>
        <info-tile title="Total Sales" prefix="" :text="totalSales" color="#17a2b8" />
      </slide>
      <slide>
        <info-tile title="Refunds" prefix="" :text="totalRefunds" color="#EE2B4B" />
      </slide>
      <slide>
        <info-tile title="Commission" :text="totalCommission.toFixed(2)" />
      </slide>
      <slide>
        <info-tile title="Vouchers" prefix="" :text="totalVouchers" color="#17a2b8" />
      </slide>
      <slide>
        <info-tile title="Chargebacks" prefix="" :text="totalChargebacks" color="#EE2B4B" />
      </slide>
    </info-carousel>

    <v-layout v-if="salesData != null" class="px-1">
      <v-btn class="mx-0 text-none" disabled flat>Packages ({{ sortOptions[currentSortOrder] }})
      </v-btn>
      <v-spacer />
      <v-menu left offset-x>
        <v-btn class="mx-0 px-2 text-none" flat slot="activator">Sort by
          <v-icon class="ml-1" right>$vuetify.icons.dropdown</v-icon>
        </v-btn>

        <v-list dense class="pa-0">
          <v-list-tile v-for="(option, index) in sortOptions" :key="index" @click="ChangeSortOrder(index)">
            <v-list-tile-title :class="{'selected-option' : index == currentSortOrder}">{{ option }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu left offset-x>
        <v-btn class="mx-0 px-2 text-none" flat slot="activator">Order
          <v-icon class="ml-1" right>$vuetify.icons.dropdown</v-icon>
        </v-btn>

        <v-list dense class="pa-0">
          <v-list-tile v-for="(option, index) in orderOptions" :key="index" @click="ChangeOrder(index)">
            <v-list-tile-title :class="{'selected-option' : index == currentOrder}">{{ option }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-layout>

    <v-layout v-if="salesData != null" row wrap>
      <package-tile v-for="(item, index) in packagesData" :key="index" :packageData="item" :term="searchTerm" />
    </v-layout>

    <snackbar :value="showSnackbar" :callback="GetSalesData" />
  </div>
</template>

<script>
import Api from '@/api';
import NavBar from "@/components/Navbar.vue";
import InfoCarousel from '@/components/InfoCarousel.vue';
import InfoTile from '@/components/InfoTile.vue';
import PackageTile from '@/components/PackageTile.vue';
import Snackbar from '@/components/Snackbar.vue';
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  activated() {
    if (!this.$store.getters.pubIdStatus)
      return this.RedirectToSettings(this.$router);

    this.salesPeriod = this.$store.getters.getCurrentMonth;
  },
  data() {
    return {
      navbarTitle: 'Sales',
      searchTerm: '',
      sortOptions: ['Name', 'Price', 'Quantity', 'Refunds', 'Chargebacks', 'Revenue', 'First Sale Date', 'Last Sale Date'],
      orderOptions: ['Ascending (A - Z)', 'Descending (Z -A)'],
      currentSortOrder: this.$store.getters.getSortOrder,
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
  watch: {
    salesPeriod() {
      this.GetSalesData();
    }
  },
  methods: {
    GetSalesData() {
      let id = this.$store.getters.getPubId;

      let endpoint = `/publisher-info/sales/${id}/${this.salesPeriod.replace('-', '')}.json`;

      this.loading = true;
      this.showSnackbar = false;

      Api.get(endpoint.trim())
        .then((response) => {
          let data = response.data.aaData;

          if (data == null || data.length <= 0) {
            return this.$swal('Error', 'No records found', 'error');
          }

          this.navbarTitle = new Date(this.salesPeriod).toLocaleString(navigator.language, {
            month: 'long',
            year: 'numeric'
          });

          this.salesData = data[0];
          this.PopulateSalesData(data);
        })
        .catch((error) => {
          console.log(error);
          this.showSnackbar = true;
        })
        .then(() => {
          this.loading = false;
        });
    },
    PopulateSalesData(data) {
      let grossRevenue = 0;

      this.packagesData.splice(0, this.packagesData.length)

      if (data.length > 0) {
        data.forEach(item => {
          this.packagesData.push(item);

          let gross = Number(item[5].replace('$', ''));
          let qty = Number(item[2]);

          if (gross === 0)
            this.vouchers += qty;

          grossRevenue += gross;
          this.totalSales += qty;
          this.totalRefunds += Number(item[3]);
          this.totalChargebacks += Number(item[4]);
        });

        let payoutRate = Number(this.$store.getters.getPubRate) || 0.7;

        this.netRevenue = grossRevenue * payoutRate;
        this.totalCommission = grossRevenue * (1 - payoutRate);
      }
    },
    ChangeSortOrder(index) {
      this.$store.dispatch('saveSortOrder', index);
      this.currentSortOrder = index;

      let desc = this.currentOrder === 0 ? true : false;

      this.packagesData.sort(function (a, b) {
        let x, y;

        if (index == 1 || index == 5) {
          x = Number(a[index].replace('$', ''));
          y = Number(b[index].replace('$', ''));
        }
        else {
          x = a[index].toUpperCase();
          y = b[index].toUpperCase();
        }

        if (desc) {
          if (x > y) {
            return 1;
          }
          if (x < y) {
            return -1;
          }
          return 0;
        } else {
          if (x > y) {
            return -1;
          }
          if (y > x) {
            return 1;
          }
          return 0;
        }
      });
    },
    ChangeOrder(index) {
      this.currentOrder = index;
      this.ChangeSortOrder(Number(this.$store.getters.getSortOrder));
    }
  },
  components: {
    NavBar,
    InfoCarousel,
    InfoTile,
    PackageTile
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
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
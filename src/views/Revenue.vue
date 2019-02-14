<template>
  <div class="section">
    <loader
      v-if="loading"
      class="fill"
      :message="loadingMessage" />

    <nav-bar title="Revenue" />

    <info-carousel v-if="revenueData != null">
      <slide>
        <info-tile
          title="Current Balance"
          prefix=""
          :text="currentBalance" />
      </slide>
      <slide>
        <info-tile
          title="Net Revenue"
          :text="netRevenue.toFixed(2)"
          color="#17a2b8" />
      </slide>
      <slide>
        <info-tile
          title="Total Payout"
          :text="totalPayout.toFixed(2)"
          color="#EE2B4B" />
      </slide>
      <slide>
        <info-tile
          title="Total Commission"
          :text="totalCommission.toFixed(2)" />
      </slide>
      <slide>
        <info-tile
          title="Average Revenue"
          :text="averageRevenue.toFixed(2)"
          color="#17a2b8" />
      </slide>
      <slide>
        <info-tile
          title="Total Months"
          prefix=""
          :text="totalMonths"
          color="#EE2B4B" />
      </slide>
    </info-carousel>

    <canvas
      id="revenueChart"
      class="mt-3"
      height="320" />

    <p
      v-if="revenueData != null"
      class="mt-3 text-xs-center font-weight-medium fill">
      * Excluding current month's sales.
    </p>

    <snackbar
      :value="showSnackbar"
      :callback="GetRevenueData" />
  </div>
</template>

<script>
import Api from '@/api'
import NavBar from '@/components/Navbar.vue'
import InfoCarousel from '@/components/InfoCarousel.vue'
import InfoTile from '@/components/InfoTile.vue'
import Snackbar from '@/components/Snackbar.vue'
import Chart from '@/../node_modules/chart.js/dist/Chart.min.js'
import { SharedMethods } from '@/mixins'
import { monthsAbbreviations } from '@/constants/chart-options.js'

export default {
  components: {
    NavBar,
    InfoCarousel,
    InfoTile,
    Snackbar
  },
  mixins: [SharedMethods],
  data () {
    return {
      revenueData: null,
      currentBalance: null,
      netRevenue: null,
      totalPayout: null,
      totalCommission: null,
      averageRevenue: null,
      totalMonths: null,
      showSnackbar: false,
      loading: false,
      loadingMessage: 'Fetching revenue data'
    }
  },
  activated () {
    if (!this.$store.getters.pubIdStatus) { return this.RedirectToSettings(this.$router) }

    if (this.revenueData == null) { this.GetRevenueData() }
  },
  methods: {
    GetRevenueData () {
      let id = this.$store.getters.getPubId
      let endpoint = `/publisher-info/revenue/${id}.json`

      this.loading = true
      this.showSnackbar = false

      Api.get(endpoint.trim())
        .then((response) => {
          let data = response.data.aaData

          if (data == null || data.length <= 0) {
            return this.$swal('Error', 'No records found', 'error')
          }

          this.revenueData = data[0]
          this.PopulateRevenueData(data)
        })
        .catch((error) => {
          console.log(error)
          this.showSnackbar = true
        })
        .then(() => {
          this.loading = false
        })
    },
    PopulateRevenueData (data) {
      let entryDate

      let chartData = []

      let chartLabels = []

      if (data.length > 0) {
        data.forEach(item => {
          let Debit = Number(item[2].replace('$', ''))
          let Credit = Number(item[3].replace('$', ''))

          if (item[1].toLowerCase().includes('revenue for')) {
            this.netRevenue += Debit
            this.netRevenue += Credit

            if (!item[1].toLowerCase().includes('fixing')) {
              this.totalMonths++

              entryDate = new Date('01 ' + item[1].toLowerCase().replace('sale', '').replace('revenue', '').replace('for', '').trim())

              chartData.push(Debit.toFixed(2))
              chartLabels.push(monthsAbbreviations[entryDate.getMonth()] + ' ' + entryDate.getFullYear())

              if (chartData.length > 6) { chartData.shift() }

              if (chartLabels.length > 6) { chartLabels.shift() }
            }
          }

          if (item[1].toLowerCase().includes('asset store payout')) {
            this.totalPayout += Credit * -1
            this.totalPayout += Debit * -1
          }
        })

        let payoutRate = Number(this.$store.getters.getPubRate) || 0.7

        this.currentBalance = data[data.length - 1][4].replace(' ', '')
        this.totalCommission = (this.netRevenue * (1 - payoutRate)) / payoutRate
        this.averageRevenue = this.netRevenue / this.totalMonths

        this.DrawChart(chartData, chartLabels)
      }
    },
    DrawChart (chartData, chartLabels) {
      const ctx = document.getElementById('revenueChart').getContext('2d')

      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            data: chartData,
            fill: false,
            pointBackgroundColor: '#339AF0',
            borderColor: '#339AF0',
            pointHitRadius: 20,
            pointRadius: 5,
            pointStyle: 'circle',
            cubicInterpolationMode: 'monotone'
          }],
          labels: chartLabels
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            displayColors: false,
            backgroundColor: '#4A4C4F',
            bodyFontSize: 16,
            titleFontSize: 15,
            callbacks: {
              title: ([tooltipItems], data) => {
                return data.labels[tooltipItems.index]
              },
              label: (tooltipItem, data) => {
                return `$${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}`
              }
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontSize: 14
              }
            }],
            xAxes: [{
              ticks: {
                fontSize: 14
              }
            }]
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

canvas {
  width: 90% !important;
}

p {
  color: $dark;
}
</style>

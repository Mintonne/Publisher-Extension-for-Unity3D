<template>
  <div id="app">
    <loader
      v-if="loading"
      class="fill"
      :message="loadingMessage" />
    <canvas id="trend-chat" />
    <save
      v-if="myChart != null"
      id="save-chart-button"
      size="30"
      @click.native="InitSave" />
  </div>
</template>

<script>
import Api from '@/api'
import saveAs from 'file-saver'
import Chart from '@/../node_modules/chart.js/dist/Chart.min.js'
import Loader from '@/components/Loader.vue'
import Save from 'vue-mdi/ContentSave.vue'
import { SharedMethods } from '@/mixins'
import { monthsNames, chartColors } from '@/constants/chart-options.js'

export default {
  components: { Loader, Save },
  mixins: [SharedMethods],
  data () {
    return {
      myChart: null,
      loading: false,
      loadingMessage: 'Fetching revenue data'
    }
  },
  mounted () {
    let id = this.$store.getters.getPubId

    if (id == null) {
      return this.$swal.fire('Error', 'Publisher ID not found.', 'error')
    }

    let endpoint = `/publisher-info/revenue/${id}.json`

    this.loading = true

    Api.get(endpoint)
      .then((response) => {
        let trendData = response.data

        Chart.plugins.register({
          beforeDraw: function (c) {
            let ctx = c.chart.ctx
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, c.chart.width, c.chart.height)
          }
        })

        let yearsData = []; let data = []; let Debit; let Description; let entryDate; let curYear; let curMonth

        if (trendData.aaData.length > 0) {
          trendData.aaData.forEach(item => {
            Debit = Number(item[2].replace('$', ''))

            Description = item[1].toLowerCase()

            if (Description.includes('revenue for') && !Description.includes('fixing')) {
              entryDate = new Date('01 ' + Description.replace(/sale|revenue|for/g, '').trim())

              curYear = entryDate.getFullYear()
              curMonth = entryDate.getMonth()

              if (curYear != null && !yearsData.includes(curYear, 0)) { yearsData.push(curYear) }

              if (data[yearsData.indexOf(curYear)] == null) { data[yearsData.indexOf(curYear)] = [] }

              data[yearsData.indexOf(curYear)][curMonth] = Debit.toFixed(2)
            }
          })
        }

        data.forEach(item => {
          for (let x = 0; x < 12; x++) {
            if (item[x] == null) { item[x] = '0' }
          }
        })

        const showZeroPlugin = {
          beforeRender: function (chartInstance) {
            let datasets = chartInstance.config.data.datasets

            for (let i = 0; i < datasets.length; i++) {
              let meta = datasets[i]._meta
              // It counts up every time you change something on the chart so
              // this is a way to get the info on whichever index it's at
              let metaData = meta[Object.keys(meta)[0]]
              let bars = metaData.data

              for (let j = 0; j < bars.length; j++) {
                let model = bars[j]._model

                if (metaData.type === 'horizontalBar' && model.base === model.x) {
                  model.x = model.base + 3
                } else if (model.base === model.y) {
                  model.y = model.base - 3
                }
              }
            }
          }
        }

        const ctx = document.getElementById('trend-chat')

        this.myChart = new Chart(ctx, {
          plugins: [showZeroPlugin],
          type: 'bar',
          data: {
            datasets: [],
            labels: monthsNames
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: `Revenue Trend Analysis ${yearsData.length > 1 ? `(${yearsData[0]} - ${yearsData[yearsData.length - 1]})` : `(${yearsData[0]})`}`,
              fontSize: 20,
              padding: 20
            },
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                boxWidth: 50,
                fontSize: 16
              }
            },
            tooltips: {
              displayColors: false,
              backgroundColor: '#4A4C4F',
              bodyFontSize: 16,
              titleFontSize: 13,
              callbacks: {
                title: ([tooltipItems], data) => {
                  return `${data.labels[tooltipItems.index]} ${yearsData[tooltipItems.datasetIndex]}`
                },
                label: (tooltipItem, data) => {
                  return `$${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}`
                }
              }
            },
            scales: {
              xAxes: [{
                ticks: {
                  fontSize: 15,
                  fontStyle: 'bold'
                }
              }],
              yAxes: [{
                offset: true,
                ticks: {
                  display: true,
                  beginAtZero: true,
                  fontSize: 15,
                  fontStyle: 'bold',
                  callback: value => {
                    return value
                  }
                }
              }]
            }
          }
        })

        data.forEach((item, index) => {
          this.myChart.data.datasets.push({
            label: yearsData[index],
            backgroundColor: chartColors[index],
            data: item
          })
        })

        this.myChart.update()
      })
      .catch((error) => {
        console.log(error)
        this.RequestError()
      })
      .then(() => {
        this.loading = false
      })
  },
  methods: {
    InitSave () {
      this.$swal.fire({
        type: 'question',
        title: 'Save Chart',
        text: 'Do you want to hide the Revenue axis?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.SaveChart(true)
        } else if (result.dismiss === 'cancel') {
          this.SaveChart()
        }
      })
    },
    SaveChart (hideAxis = false) {
      if (hideAxis) {
        this.myChart.config.options.scales.yAxes[0].ticks.callback = () => {
          return ''
        }

        this.myChart.update({
          duration: 0
        })
      };

      this.myChart.ctx.canvas.toBlob(blob => {
        saveAs(blob, `chart-${Date.now()}.png`)
      })

      if (hideAxis) {
        this.myChart.config.options.scales.yAxes[0].ticks.callback = value => {
          return value
        }

        this.myChart.update({
          duration: 0
        })
      };
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

#save-chart-button {
  user-select: none;
  position: fixed;
  top: 15px;
  right: 15px;
  color: $dark;
  cursor: pointer;
}
</style>

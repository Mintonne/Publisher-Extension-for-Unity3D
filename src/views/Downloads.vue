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
            v-model="downloadsPeriod"
            color="#339af0"
            :min="minDate"
            :max="maxDate"
            type="month"
            :show-current="downloadsPeriod"
            width="250"
            no-title
            scrollable
            @input="changeMonth" />
        </v-menu>
      </v-flex>
    </v-layout>

    <info-tile
      v-if="downloadsData != null"
      prefix=""
      title="Total Downloads"
      :text="totalDownloads" />

    <v-layout
      v-if="downloadsData != null && downloadsData.length > 0"
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
      v-if="downloadsData != null && downloadsData.length > 0"
      row
      wrap>
      <package-tile
        v-for="(item, index) in packagesData"
        :key="index"
        :package-data="item"
        :term="searchTerm"
        downloads />
    </v-layout>

    <snackbar
      :value="showSnackbar"
      :callback="GetDownloadsData"
      :timeout="5000" />
  </div>
</template>

<script>
import Api from '@/api'
import NavBar from '@/components/Navbar.vue'
import InfoTile from '@/components/InfoTile.vue'
import PackageTile from '@/components/PackageTile.vue'
import Snackbar from '@/components/Snackbar.vue'
import { SharedMethods } from '@/mixins'

export default {
  components: {
    NavBar,
    InfoTile,
    PackageTile,
    Snackbar
  },
  mixins: [SharedMethods],
  data () {
    return {
      navbarTitle: 'Free Downloads',
      searchTerm: '',
      showPicker: false,
      minDate: this.$store.getters.getFirstMonth,
      maxDate: new Date().toISOString().substr(0, 10),
      sortOptions: ['Name', 'Downloads', 'First Download Date', 'Last Download Date'],
      orderOptions: ['Ascending (A - Z)', 'Descending (Z - A)'],
      currentSortOrder: this.$store.getters.getDownloadsSortOrder,
      currentOrder: 1,
      downloadsData: null,
      packagesData: [],
      downloadsPeriod: null,
      totalDownloads: 0,
      showSnackbar: false,
      loading: false,
      loadingMessage: 'Fetching free downloads data'
    }
  },
  activated () {
    if (!this.$store.getters.pubIdStatus) { return this.RedirectToSettings(this.$router) }

    if (this.downloadsPeriod == null) { this.downloadsPeriod = this.$store.getters.getCurrentMonth }

    if (this.downloadsData == null) { this.GetDownloadsData() }
  },
  methods: {
    changeMonth () {
      this.showPicker = false
      this.GetDownloadsData()
    },
    GetDownloadsData () {
      let id = this.$store.getters.getPubId

      let endpoint = `/publisher-info/downloads/${id}/${this.downloadsPeriod.replace(/-/g, '')}.json`

      this.loading = true
      this.showSnackbar = false

      Api.get(endpoint.trim())
        .then((response) => {
          let data = response.data.aaData

          this.navbarTitle = new Date(this.downloadsPeriod).toLocaleString(navigator.language, {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
          })

          this.downloadsData = data

          if (data == null) {
            return this.$swal.fire('Error', 'No records found', 'error')
          }

          this.PopulateDownloadsData(data)
        })
        .catch((error) => {
          console.log(error)
          this.showSnackbar = true
        })
        .then(() => {
          this.loading = false
        })
    },
    PopulateDownloadsData (data) {
      this.totalDownloads = 0

      if (data.length <= 0) { return }

      this.packagesData.splice(0, this.packagesData.length)

      data.forEach(item => {
        this.packagesData.push(item)

        this.totalDownloads += Number(item[1])
      })

      this.searchTerm = ''
      this.SortPackages()
    },
    ChangeSortOrder (index) {
      this.$store.dispatch('saveDownloadsSortOrder', index)
      this.currentSortOrder = index

      this.SortPackages()
    },
    ChangeOrder (index) {
      this.currentOrder = index
      this.ChangeSortOrder(Number(this.$store.getters.getDownloadsSortOrder))

      this.SortPackages()
    },
    SortPackages () {
      let index = this.currentSortOrder
      let desc = this.currentOrder === 0

      this.packagesData.sort(function (a, b) {
        let x, y

        if (index === 1) {
          x = Number(a[index])
          y = Number(b[index])
        } else {
          x = a[index].toUpperCase()
          y = b[index].toUpperCase()
        }

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

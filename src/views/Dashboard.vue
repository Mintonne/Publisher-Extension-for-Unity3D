<template>
  <div class="section">
    <nav-bar title="Dashboard" />
    <v-flex xs12>
      <v-text-field
        v-model="searchTerm"
        label="Search"
        solo
        single-line />
    </v-flex>
    <v-container
      grid-list-lg
      text-xs-center
      pa-0>
      <v-layout
        row
        wrap>
        <dash-tile
          v-for="(tile, index) in tiles"
          v-show="searchMatch(tile.name)"
          :key="index"
          :name="tile.name"
          :icon="tile.icon"
          :path="tile.path || null"
          :url="tile.url || null" />
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import NavBar from '@/components/Navbar.vue'
import DashTile from '@/components/DashTile.vue'

export default {
  components: {
    NavBar,
    DashTile
  },
  data: () => {
    return {
      searchTerm: '',
      tiles: [
        { name: 'Sales', icon: 'sales', path: 'sales' },
        { name: 'Downloads', icon: 'download', path: 'downloads' },
        { name: 'Revenue', icon: 'bank', path: 'revenue' },
        { name: 'Verify Invoice', icon: 'verified', path: 'verify' },
        { name: 'Reviews', icon: 'review', path: 'reviews' },
        { name: 'Trend Analysis', icon: 'trendingUp', url: 'trends.html' },
        { name: 'Settings', icon: 'settings', path: 'settings' }
      ]
    }
  },
  methods: {
    searchMatch (name) {
      return (this.searchTerm === '' || this.searchTerm == null || name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    }
  }
}
</script>

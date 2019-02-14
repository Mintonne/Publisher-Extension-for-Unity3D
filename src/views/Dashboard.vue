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
          name="Sales"
          icon="sales"
          path="/sales"
          :term="searchTerm" />
        <dash-tile
          name="Downloads"
          icon="download"
          path="/downloads"
          :term="searchTerm" />
        <dash-tile
          name="Revenue"
          icon="bank"
          path="/revenue"
          :term="searchTerm" />
        <dash-tile
          name="Verify Invoice"
          icon="verified"
          path="/verify"
          :term="searchTerm" />
        <dash-tile
          name="Reviews"
          icon="review"
          path="/reviews"
          :term="searchTerm" />
        <dash-tile
          name="Trend Analysis"
          icon="trending_up"
          :term="searchTerm"
          url="./trend-analysis.html" />
        <dash-tile
          name="Settings"
          icon="settings"
          path="/settings"
          :term="searchTerm" />
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
      searchTerm: ''
    }
  }
}
</script>

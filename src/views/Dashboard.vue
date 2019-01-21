<template>
  <div class="section">
    <nav-bar title="Dashboard"></nav-bar>
    <v-flex xs12>
      <v-text-field v-model="searchTerm" label="Search" solo single-line>
      </v-text-field>
    </v-flex>
    <v-container grid-list-lg text-xs-center pa-0>
      <v-layout row wrap>
        <dash-tile name="Sales" icon="dollar-sign" path="/sales" :term="searchTerm"></dash-tile>
        <dash-tile name="Downloads" icon="download" path="/downloads" :term="searchTerm"></dash-tile>
        <dash-tile name="Revenue" icon="bank" path="/revenue" :term="searchTerm"></dash-tile>
        <dash-tile name="Verify Invoice" icon="verified" path="/verify" :term="searchTerm"></dash-tile>
        <dash-tile name="Reviews" icon="review" path="/reviews" :term="searchTerm"></dash-tile>
        <dash-tile name="Trend Analysis" icon="trending-up" :term="searchTerm" url="./trend-analysis.html"></dash-tile>
        <dash-tile name="Settings" icon="settings" path="/settings" :term="searchTerm"></dash-tile>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import NavBar from '@/components/TheNavBar.vue';
import DashTile from '@/components/DashTile.vue';

export default {
  data: () => {
    return {
      searchTerm: ''
    }
  },
  components: {
    NavBar,
    DashTile
  }
}
</script>
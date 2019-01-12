<template>
  <div class="section">
    <nav-bar title="Dashboard"></nav-bar>
    <v-flex xs12 mt-4>
      <v-text-field v-model="searchTerm" label="Search" solo single-line clearable>
      </v-text-field>
    </v-flex>
    <v-container grid-list-lg text-xs-center pa-0>
      <v-layout row wrap>
        <dash-tile name="Sales" icon="attach_money" path="/sales" :term="searchTerm"></dash-tile>
        <dash-tile name="Downloads" icon="get_app" path="/downloads" :term="searchTerm"></dash-tile>
        <dash-tile name="Revenue" icon="credit_card" path="/revenue" :term="searchTerm"></dash-tile>
        <dash-tile name="Verify Invoice" icon="verified_user" path="/verify" :term="searchTerm"></dash-tile>
        <dash-tile name="Reviews" icon="trending_up" url="https://www.example.com" :term="searchTerm"></dash-tile>
        <dash-tile name="Trend Analysis" icon="rate_review" :term="searchTerm"></dash-tile>
        <dash-tile name="Settings" icon="settings" path="/settings" :term="searchTerm"></dash-tile>
      </v-layout>
    </v-container>
</template>

<script>
import NavBar from "@/components/TheNavBar.vue";
import DashTile from "@/components/DashTile.vue";

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
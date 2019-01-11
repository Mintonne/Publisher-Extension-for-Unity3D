<template>
  <div class="section">
    <nav-bar title="Dashboard"></nav-bar>
    <v-flex xs12 mt-4>
      <v-text-field v-model="searchText" label="Search" solo single-line clearable>
      </v-text-field>
    </v-flex>
    <p>{{ searchText }}</p>
  </div>
</template>

<script>
import NavBar from "@/components/TheNavBar.vue";

export default {
  data: () => {
    return {
      searchText: ''
    }
  },
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
</style>
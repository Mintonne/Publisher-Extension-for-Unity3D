<template>
  <div class="section">
    <nav-bar title="Reviews"></nav-bar>
  </div>
</template>

<script>
import NavBar from "@/components/TheNavBar.vue";
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  created() {
    if (!this.$store.getters.pubIdStatus)
      this.RedirectToSettings(this.$router);
    else if (this.$store.getters.getReviewsFeed == null)
      this.RedirectToSettings(this.$router, false);
  },
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
</style>
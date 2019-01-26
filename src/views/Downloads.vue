<template>
  <div class="section">
    <nav-bar title="Downloads"></nav-bar>
  </div>
</template>

<script>
import NavBar from "@/components/Navbar.vue";
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  activated() {
    if (!this.$store.getters.pubIdStatus)
      return this.RedirectToSettings(this.$router);
  },
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
</style>
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
  created() {
    if (!this.$store.getters.pubIdStatus)
      this.RedirectToSettings(this.$router);
  },
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
</style>
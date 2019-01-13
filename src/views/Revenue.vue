<template>
  <div class="section">
    <nav-bar title="Revenue"></nav-bar>
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
  },
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
</style>
<template>
  <div id="app">
    <app-sidebar></app-sidebar>
    <router-view />
  </div>
</template>

<script>
import Sidebar from './components/TheSidebar.vue';

export default {
  components: {
    appSidebar: Sidebar
  }
}
</script>

<style lang="scss">
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  font-size: 16px;
}

html,
body {
  width: 800px;
  height: 580px;
}

body {
  overflow: auto;
}
</style>

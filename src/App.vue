<template>
  <div id="app">
    <sidebar />
    <router-view />
  </div>
</template>

<script>
import Sidebar from '@/components/TheSidebar.vue';

export default {
  components: {
    Sidebar
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

  > #app {
    background-color: #fcfcfc;
    width: 100%;
    height: 100%;
  }
}

.section {
  width: 740px;
  height: 100%;
  margin-left: 60px;
  overflow-x: hidden;
  overflow-y: auto;

  > * {
    width: 85%;
    margin: 0 auto;
  }
}
</style>

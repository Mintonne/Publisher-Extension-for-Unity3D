<template>
  <div id="app">
    <sidebar />
    <router-view />
  </div>
</template>

<script>
import Sidebar from '@/components/TheSidebar.vue';
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  created() {
    this.loginStatus(this.$store);
  },
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

    .section {
      width: 740px;
      height: 100%;
      margin-left: 60px;
      overflow: hidden;

      > *:not(.fill) {
        width: 85%;
        margin: 0 auto;
      }
    }
  }
}

.svg-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  color: inherit;
  vertical-align: middle;
  fill: none;
  stroke: currentColor;

  &.svg-fill {
    fill: currentColor;
    stroke: none;
  }
}
</style>

<template>
  <div id="app">
    <h1>Hello! I am a {{ Browser }} Heading</h1>
    <router-view />
  </div>
</template>

<script>
export default {

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

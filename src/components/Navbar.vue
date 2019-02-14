<template>
  <nav class="fill">
    <a class="font-weight-medium">{{ title }}</a>
  </nav>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Title Goes Here'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

nav {
  height: 45px;
  width: 100%;
  margin-bottom: 15px;
  user-select: none;

  a {
    width: 100%;
    display: inline-block;
    line-height: 45px;
    text-decoration: none;
    text-align: center;
    color: $dark;
  }
}
</style>

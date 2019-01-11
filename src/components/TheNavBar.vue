<template>
  <ul class="nav justify-content-center">
    <li class="nav-item">
      <a class="nav-link disabled">{{ title }}</a>
    </li>
  </ul>
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
.nav {
  pointer-events: none;
  user-select: none;
}
</style>
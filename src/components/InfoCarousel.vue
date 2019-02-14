<template>
  <carousel
    :autoplay="true"
    :autoplay-timeout="5000"
    :loop="true"
    :navigation-enabled="true"
    :navigation-click-target-size="20"
    :pagination-enabled="false"
    :per-page="3">
    <slot />
  </carousel>
</template>

<style lang="scss">
@import "@/styles/variables.scss";

.VueCarousel-navigation {
  button.VueCarousel-navigation-button {
    color: $dark;

    &:focus {
      outline: none;
    }
  }
}
</style>

<template>
  <carousel
    :autoplay="true"
    :autoplayTimeout="5000"
    :loop="true"
    :navigationEnabled="true"
    :navigationClickTargetSize="20"
    :paginationEnabled="false"
    :perPage="3">
    <slot></slot>
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
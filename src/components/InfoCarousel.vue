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

<style>
.VueCarousel-navigation button.VueCarousel-navigation-button:focus {
  outline: none;
}
</style>
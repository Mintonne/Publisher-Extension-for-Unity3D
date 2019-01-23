<template>
  <v-card class="text-xs-center" elevation="3" height="90">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text :style="{color}">{{ prefix }}{{ text }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      default: '$'
    },
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#339af0'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.v-card {
  margin: 5px;

  .v-card__title {
    display: block;
    margin: 0 auto;
    color: $dark;
    font-weight: 500;
    padding: 8px;
  }

  .v-card__text {
    font-size: 25px;
    padding: 8px;
  }
}
</style>

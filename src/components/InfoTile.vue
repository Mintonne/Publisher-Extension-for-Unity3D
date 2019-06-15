<template>
  <v-card
    class="text-xs-center"
    elevation="3"
    height="90">
    <v-card-title>
      <p class="mx-auto my-0">
        {{ title }}
      </p>
    </v-card-title>
    <v-card-text :style="{color}">
      {{ prefix }}{{ text }}
    </v-card-text>
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
.v-card {
  margin: 5px;

  > div {
    height: 50%;
  }

  .v-card__title {
    padding: 5px;

    p {
      color: $dark;
    }
  }

  .v-card__text {
    font-size: 24px;
    padding: 8px;
  }
}
</style>

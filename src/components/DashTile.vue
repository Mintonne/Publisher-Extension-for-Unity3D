<template>
  <v-flex xs3>
    <v-card
      class="card-tile"
      hover
      :to="path"
      height="140"
      @click="OpenLink(url)">
      <v-card-title>
        <v-icon
          class="dash-icon mx-auto"
          color="#bbb"
          size="40"
          title="">
          {{ iconName }}
        </v-icon>
      </v-card-title>
      <v-card-text class="card-text font-weight-medium">
        {{ name }}
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { SharedMethods } from '@/mixins'

export default {
  mixins: [SharedMethods],
  props: {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: '/'
    },
    url: {
      type: String,
      default: null
    }
  },
  computed: {
    iconName () {
      return '$vuetify.icons.' + this.icon
    }
  }
}
</script>

<style lang="scss" scoped>
.card-tile {
  &:hover {
    * {
      color: $primary-color !important;
    }
  }

  .card-text {
    color: $dark;
  }
}
</style>

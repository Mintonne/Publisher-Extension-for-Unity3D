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
          class="card-icon mx-auto"
          color="#bbb"
          width="45"
          height="45">
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

  .card-icon {
    height: 45px;
  }

  .card-text {
    color: $dark;
  }
}
</style>

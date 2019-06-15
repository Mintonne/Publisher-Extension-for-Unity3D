<template>
  <v-flex
    v-if="searchMatch"
    xs3>
    <v-card
      hover
      :to="path"
      height="140"
      @click="OpenLink(url)">
      <v-card-title>
        <v-icon
          width="45"
          height="45"
          v-text="iconName" />
      </v-card-title>
      <v-card-text>{{ name }}</v-card-text>
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
    },
    term: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName () {
      return '$vuetify.icons.' + this.icon
    },
    searchMatch () {
      return (this.term === '' || this.term == null || this.name.toLowerCase().includes(this.term.toLowerCase()))
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  &:hover {
    * {
      color: $primary-color !important;
    }
  }

  .v-card__title {
    .v-icon {
      margin: 0 auto;
      color: #bbb;
      height: 45px;
    }
  }

  .v-card__text {
    color: $dark;
    font-weight: 500;
  }
}
</style>

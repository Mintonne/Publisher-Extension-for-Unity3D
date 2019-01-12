<template>
  <v-flex xs3>
    <v-card hover :to="path" height=140>
    <v-card hover @click="open(url)" :to="path" height=140>
      <v-card-title>
        <v-icon x-large>{{ icon }}</v-icon>
      </v-card-title>
      <v-card-text>
        <h3>{{ name }}</h3>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { openLink } from '@/mixins/openLink'

export default {
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
      type: String
    }
  }
  mixins: [openLink]
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.v-card {
  border-radius: 10px;

  &:hover {
    * {
      color: $primary-color;
    }
  }
}

.v-icon {
  margin: 0 auto;
  color: #ccc;
}

.v-card__text {
  color: $dark;
  font-weight: 600;
}
</style>
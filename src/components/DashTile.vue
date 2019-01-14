<template>
  <v-flex xs3 v-if="searchMatch">
    <v-card hover @click="OpenLink(url)" :to="path" height=140>
      <v-card-title>
        <i>
          <svgicon :icon="icon"></svgicon>
        </i>
      </v-card-title>
      <v-card-text>
        <p>{{ name }}</p>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { SharedMethods } from '@/mixins';
import '@/assets/icons/index';

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
      type: String
    }
  },
  computed: {
    searchMatch() {
      return (this.term == '' || this.term == null || this.name.toLowerCase().includes(this.term.toLowerCase()));
    }
  }
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

.v-card__title {
  i {
    margin: 0 auto;
    color: #bbb;
  }
  .svg-icon {
    width: 45px;
    height: 45px;
  }
}

.v-card__text {
  color: $dark;
  font-weight: 600;
}
</style>
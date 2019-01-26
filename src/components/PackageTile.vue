<template>
  <v-flex xs4 v-if="searchMatch">
    <v-card class="text-xs-center" elevation="3" hover height="120">
      <v-card-title>
        <p class="mx-auto my-0">{{ ellipsis(packageData[0], 35) }}</p>
      </v-card-title>
      <v-card-text>
        <p class="mx-auto my-0">{{ packageData[getSortOrder] }}</p>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  props: {
    packageData: {
      type: String,
      required: true
    },
    term: {
      type: String
    }
  },
  computed: {
    getSortOrder() {
      return this.$store.getters.getSortOrder == 0 ? 1 : this.$store.getters.getSortOrder;
    },
    searchMatch() {
      return (this.term == '' || this.term == null || this.packageData[0].toLowerCase().includes(this.term.toLowerCase()));
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.v-card {
  margin: 5px;

  > div {
    height: 50%;
  }

  .v-card__title {
    padding: 5px;

    p {
      color: $dark;
      font-size: 18px;
    }
  }

  .v-card__text {
    display: flex;
    align-items: center;
    padding: 5px;
    color: $primary-color;

    p {
      font-size: 25px;
    }
  }
}
</style>
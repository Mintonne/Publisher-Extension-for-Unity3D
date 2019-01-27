<template>
  <v-flex xs4 v-if="searchMatch">
    <v-card class="text-xs-center" elevation="3" hover height="120">
      <div v-if="showWarning" id="warning"></div>
      <v-card-title>
        <p class="mx-auto my-0">{{ ellipsis(packageData[0], 35) }}</p>
      </v-card-title>
      <v-card-text>
        <p class="mx-auto my-0">{{ packageData[getSortOrder].replace(/\s/g,'') }}</p>
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
      let sortOrder = this.$store.getters.getSortOrder == 0 ? 1 : this.$store.getters.getSortOrder;
      return sortOrder;
    },
    searchMatch() {
      return (this.term == '' || this.term == null || this.packageData[0].toLowerCase().includes(this.term.toLowerCase()));
    },
    showWarning() {
      if (this.packageData[3] != "0" || this.packageData[4] != "0")
        return true;
      else
        return false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

#warning {
  position: absolute;
  top: 0;
  height: 100%;
  left: 0;
  width: 2px;
  background-color: #ee2b4b;
  opacity: 0.75;
}

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
    display: flex;
    align-items: center;
    padding: 5px;
    color: $primary-color;

    p {
      font-size: 24px;
    }
  }
}
</style>
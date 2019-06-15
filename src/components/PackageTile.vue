<template>
  <v-flex
    v-if="searchMatch"
    xs4>
    <v-card
      class="text-xs-center"
      elevation="3"
      hover
      height="120">
      <div
        v-if="showWarning"
        id="warning" />
      <v-card-title>
        <p class="mx-auto my-0">
          {{ ellipsis(packageData[0], 35) }}
        </p>
      </v-card-title>
      <v-card-text>
        <v-tooltip
          :disabled="!showTooltip"
          bottom
          transition="scale-transition">
          <p
            slot="activator"
            class="my-0">
            {{ packageData[getSortOrder].replace(/\s/g,'') }}
          </p>
          <span>Sales: {{ packageData[2] }}</span>
        </v-tooltip>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { SharedMethods } from '@/mixins'

export default {
  mixins: [SharedMethods],
  props: {
    packageData: {
      type: String,
      required: true
    },
    downloads: {
      type: Boolean,
      default: false
    },
    term: {
      type: String,
      default: ''
    }
  },
  computed: {
    showTooltip () {
      if (this.downloads) { return false }

      if (this.getSortOrder === 2) { return false }

      return this.$store.getters.getTooltipStatus
    },
    getSortOrder () {
      let sortOrder

      if (this.downloads) {
        sortOrder = this.$store.getters.getDownloadsSortOrder === 0 ? 1 : this.$store.getters.getDownloadsSortOrder
      } else {
        sortOrder = this.$store.getters.getSalesSortOrder === 0 ? 1 : this.$store.getters.getSalesSortOrder
      }

      return sortOrder
    },
    searchMatch () {
      return (this.term === '' || this.term == null || this.packageData[0].toLowerCase().includes(this.term.toLowerCase()))
    },
    showWarning () {
      if (this.downloads) { return false }

      if (this.packageData[3] !== '0' || this.packageData[4] !== '0') { return true } else { return false }
    }
  }
}
</script>

<style lang="scss" scoped>
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

    > .v-tooltip {
      width: 100%;
    }

    p {
      font-size: 24px;
    }
  }
}
</style>

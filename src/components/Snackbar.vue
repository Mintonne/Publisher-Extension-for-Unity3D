<template>
  <v-snackbar
    bottom
    class="fill"
    :timeout="timeout"
    :value="value">
    {{ message }}
    <v-btn
      color="pink"
      flat
      @click="callback()">
      {{ btnText }}
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Request Failed'
    },
    btnText: {
      type: String,
      default: 'Retry'
    },
    timeout: {
      type: Number,
      default: 0
    },
    callback: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.v-snack {
  margin-left: 60px;

  div.v-snack__wrapper {
    background-color: $dark;
  }
}
</style>

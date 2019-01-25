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
      type: null
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

<style scoped>
.v-snack {
  margin-left: 60px;
}
</style>
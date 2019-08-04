<template>
  <div
    id="sidebar"
    :class="{static: !enableTransition}">
    <ul>
      <router-link
        tag="li"
        to="/">
        <v-icon>$vuetify.icons.dashboard</v-icon>
        <p>Dashboard</p>
      </router-link>

      <router-link
        tag="li"
        to="/sales">
        <v-icon>$vuetify.icons.sales</v-icon>
        <p>Sales</p>
      </router-link>

      <router-link
        tag="li"
        to="/downloads">
        <v-icon>$vuetify.icons.download</v-icon>
        <p>Downloads</p>
      </router-link>

      <router-link
        tag="li"
        to="/revenue">
        <v-icon>$vuetify.icons.bank</v-icon>
        <p>Revenue</p>
      </router-link>

      <router-link
        tag="li"
        to="/verify">
        <v-icon>$vuetify.icons.verified</v-icon>
        <p>Verify Invoice</p>
      </router-link>

      <router-link
        tag="li"
        to="/reviews">
        <v-icon>$vuetify.icons.review</v-icon>
        <p>Reviews</p>
      </router-link>

      <router-link
        tag="li"
        to="/settings">
        <v-icon>$vuetify.icons.settings</v-icon>
        <p>Settings</p>
      </router-link>

      <li
        class="link"
        @click="OpenLink('mailto:mintonne@gmail.com')">
        <v-icon>$vuetify.icons.email</v-icon>
        <p>Support</p>
      </li>

      <li
        class="link"
        @click="OpenLink('https://www.paypal.me/mintonne/5')">
        <v-icon>$vuetify.icons.paypal</v-icon>
        <p>Donate</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { SharedMethods } from '@/mixins'

export default {
  mixins: [SharedMethods],
  computed: {
    enableTransition () {
      return this.$store.getters.getSidebarStatus
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 100vh;
  background: $dark;
  color: white;
  transition: width 200ms ease-in-out;
  z-index: 100;
  box-shadow: 0px 0px 10px #333;
  overflow: hidden;

  white-space: nowrap;
  user-select: none;

  &:hover:not(.static) {
    width: 200px;
    transition-delay: 100ms;
  }

  &.static:hover {
    width: 60px;
    transition: none;
  }

  ul {
    width: 200px;
    padding: 0;

    li {
      display: block;
      cursor: pointer;

      margin: 0 auto;
      width: 100%;

      &:hover {
        background-color: $primary-color;
      }

      &.router-link-exact-active {
        color: $primary-color;
        background-color: white;
      }

      > * {
        height: 60px;
        display: table-cell;
        vertical-align: middle;
      }

      span {
        width: 60px;
        text-align: center;
        color: inherit;
      }

      p {
        text-align: left;
      }

      &.link {
        position: absolute;
        width: 200px;

        &:nth-last-child(1) {
          bottom: 0;
        }

        &:nth-last-child(2) {
          bottom: 60px;
        }
      }
    }
  }
}
</style>

<template>
  <div id="sidebar" :class="{static: !enableTransition}">
    <ul>
      <router-link tag="li" to="/">
        <p>Dashboard</p>
      </router-link>

      <router-link tag="li" to="/sales">
        <p>Sales</p>
      </router-link>

      <router-link tag="li" to="/downloads">
        <p>Downloads</p>
      </router-link>

      <router-link tag="li" to="/revenue">
        <p>Revenue</p>
      </router-link>

      <router-link tag="li" to="/verify">
        <p>Verify Invoice</p>
      </router-link>

      <router-link tag="li" to="/settings">
        <p>Settings</p>
      </router-link>

      <li class="link" @click="OpenLink('mailto:mintonne@gmail.com')">
        <p>Support</p>
      </li>

      <li class="link" @click="OpenLink('https://www.paypal.me/mintonne/10')">
        <p>Donate</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { SharedMethods } from '@/mixins';

export default {
  mixins: [SharedMethods],
  computed: {
    enableTransition() {
      return this.$store.getters.getSidebarStatus;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

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
    display: table;
    width: 200px;
    padding: 0;

    li {
      display: table-row;
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

      i {
        width: 60px;
        text-align: center;
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
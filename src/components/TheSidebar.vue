<template>
  <div id="sidebar">
    <ul>
      <router-link tag="li" to="/">
        <i class="material-icons">dashboard</i>
        <p>Dashboard</p>
      </router-link>

      <router-link tag="li" to="/sales">
        <i class="material-icons">attach_money</i>
        <p>Sales</p>
      </router-link>

      <router-link tag="li" to="/downloads">
        <i class="material-icons">get_app</i>
        <p>Downloads</p>
      </router-link>

      <router-link tag="li" to="/revenue">
        <i class="material-icons">credit_card</i>
        <p>Revenue</p>
      </router-link>

      <router-link tag="li" to="/verify">
        <i class="material-icons">verified_user</i>
        <p>Verify Invoice</p>
      </router-link>

      <router-link tag="li" to="/settings">
        <i class="material-icons">settings</i>
        <p>Settings</p>
      </router-link>

      <li class="link" @click="open('mailto:mintonne@gmail.com')">
        <i class="myicons icon-envelope"></i>
        <p>Support</p>
      </li>

      <li class="link" @click="open('https://www.paypal.me/mintonne/10')">
        <i class="myicons icon-paypal"></i>
        <p>Donate</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { openLink } from '@/mixins/openLink'

export default {
  mixins: [openLink]
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

#sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 100%;
  background: $dark;
  color: $white;
  transition: width 200ms ease-in-out;
  z-index: 10000;
  box-shadow: 0px 0px 10px #333;
  overflow: hidden;

  white-space: nowrap;
  user-select: none;

  &:hover {
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
        background-color: $white;
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
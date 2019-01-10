<template>
  <div id="sidebar">
    <ul>
      <li class="active">
        <i class="material-icons">dashboard</i>
        <p>Dashboard</p>
      </li>
      <li>
        <i class="material-icons">attach_money</i>
        <p>Sales</p>
      </li>
      <li>
        <i class="material-icons">get_app</i>
        <p>Downloads</p>
      </li>
      <li>
        <i class="material-icons">credit_card</i>
        <p>Revenue</p>
      </li>
      <li>
        <i class="material-icons">verified_user</i>
        <p>Verify Invoice</p>
      </li>
      <li>
        <i class="material-icons">settings</i>
        <p>Settings</p>
      </li>
      <li>
        <i class="myicons icon-envelope"></i>
        <p>Support</p>
      </li>
      <li>
        <i class="myicons icon-paypal"></i>
        <p>Donate</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
#sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 100%;
  background: #4a4c4f;
  color: #fff;
  transition: width 200ms ease-in-out;
  z-index: 100;
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

    li {
      display: table-row;
      cursor: pointer;

      margin: 0 auto;
      width: 100%;

      &:hover {
        background-color: #339af0;
      }

      &.active {
        color: #339af0;
        background-color: #fff;
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

      &:nth-last-child(1),
      &:nth-last-child(2) {
        position: absolute;
        width: 200px;
      }

      &:nth-last-child(1) {
        bottom: 0;
      }

      &:nth-last-child(2) {
        bottom: 60px;
      }
    }
  }
}
</style>
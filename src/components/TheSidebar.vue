<template>
  <div id="sidebar">
    <ul id="sidebar-parent">
      <li id="dashboard-button" class="sidebarBtn">
        <i class="material-icons">dashboard</i>
        <p>Dashboard</p>
      </li>
      <li id="sales-button" class="sidebarBtn">
        <i class="material-icons">attach_money</i>
        <p>Sales</p>
      </li>
      <li id="downloads-button" class="sidebarBtn">
        <i class="material-icons">get_app</i>
        <p>Downloads</p>
      </li>
      <li id="revenue-button" class="sidebarBtn">
        <i class="material-icons">credit_card</i>
        <p>Revenue</p>
      </li>
      <li id="verify-button" class="sidebarBtn">
        <i class="material-icons">verified_user</i>
        <p>Verify Invoice</p>
      </li>
      <li id="settings-button" class="sidebarBtn">
        <i class="material-icons">settings</i>
        <p>Settings</p>
      </li>
      <li id="support-button">
        <i class="myicons icon-envelope"></i>
        <p>Support</p>
      </li>
      <li id="donate-button">
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

<style scoped>
#sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 100%;
  background: #4a4c4f;
  color: #fff;
  transition: width 300ms ease-in-out;
  z-index: 100;
  box-shadow: 0px 0px 10px #333;
  overflow: hidden;

  white-space: nowrap;
  user-select: none;
}

#sidebar:hover {
  width: 200px;
  transition-delay: 100ms;
}

#sidebar.static:hover {
  width: 60px;
  transition: none;
}

ul {
  display: table;
  width: 200px;
}

ul > li {
  display: table-row;
  cursor: pointer;

  margin: 0 auto;
  width: 100%;
}

ul > li:hover {
  background-color: #339af0;
}

ul > li.active {
  color: #339af0;
  background-color: #fff;
}

ul > li > * {
  height: 60px;
  display: table-cell;
  vertical-align: middle;
}

ul > li > i {
  width: 60px;
  text-align: center;
}

ul > li > p {
  text-align: left;
}

ul > li#support-button {
  position: absolute;
  bottom: 60px;
  width: 200px;
}

ul > li#donate-button {
  position: absolute;
  bottom: 0;
  width: 200px;
}
</style>

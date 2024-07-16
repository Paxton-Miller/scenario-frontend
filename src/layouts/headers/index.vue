<script setup>
import Hamburger from './components/hamburger.vue'
import Breadcrumb from './components/breadcrumb.vue'
import Avatar from './components/avatar.vue'
import Driver from './components/driver/index.vue'

const props = defineProps({
  showTitle: {
    default: false,
    type: Boolean,
  },
  showHamburger: {
    default: true,
    type: Boolean,
  },
  showBreadcrumb: {
    default: true,
    type: Boolean,
  },
})
</script>

<template>
  <div class="navbar">
    <RouterLink to="/admin/project">
      <h2 v-if="showTitle">
        Scenario Construction System
      </h2>
    </RouterLink>
    <Hamburger v-if="showHamburger" />
    <Breadcrumb v-if="showBreadcrumb" />
    <div class="navbar-right">
      <Driver class="navbar-itemApi" />
      <Avatar class="navbar-itemApi" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 60px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;

  .navbar-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    ::v-deep .navbar-itemApi {
      display: inline-block;
      margin-left: 18px;
      font-size: 22px;
      color: #5a5e66;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
</style>

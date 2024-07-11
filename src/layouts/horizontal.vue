<!--
  @name: horizontal
  @description: TODO
  @author: Lingkai Shi
  @date: 4/22/2024 2:38 PM
  @version: 1.0
-->
<script setup>
import Headers from './headers/index.vue'
import { useHeaderStore } from '@/store/header'

const store = useHeaderStore()
</script>

<template>
  <ElContainer class="app-wrapper">
    <ElContainer class="container">
      <ElHeader>
        <Headers
          show-title
          :show-breadcrumb="false"
          :show-hamburger="false"
        />
      </ElHeader>
      <ElMain>
        <RouterView />
        <!--
          <ElFooter height="15px">
          <div style="display: flex;justify-content: center;align-items: center;margin-top: 10px">
          <span>&copy; {{ new Date().getFullYear() }} OpenGMS &nbsp;南京师范大学</span>
          </div>
          </ElFooter>
        -->
      </ElMain>
      <ElFooter height="25px">
        <div style="display: flex;justify-content: center;align-items: center;">
          <span>&copy; {{ new Date().getFullYear() }} OpenGMS &nbsp;Nanjing Normal University</span>
        </div>
      </ElFooter>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.container {
  width: calc(100% - 0px);
  height: 100%;

  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: all 0.28s;

  &.hidderContainer {
    width: calc(100% - 67px);
  }
}

::v-deep .el-header {
  padding: 0;
}
</style>

<script setup>
import { computed } from 'vue'
import Headers from './headers/index.vue'
import Menu from '@/layouts/menu/index.vue'
import { useHeaderStore } from '@/store/header'

const store = useHeaderStore()

const asideWidth = computed(() => {
  return store.siderType
    ? '210px'
    : '67px'
})
</script>

<template>
  <ElContainer class="app-wrapper">
    <ElAside
      :width="asideWidth"
      class="sidebar-container"
    >
      <div style="color: white;font-size: larger;font-family: 微软雅黑;font-weight: bold">
        Scenario Construction
      </div>
      <Menu />
    </ElAside>
    <ElContainer
      class="container"
      :class="{ hidderContainer: !store.siderType }"
    >
      <ElHeader>
        <Headers />
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
  width: calc(100% - 210px);
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

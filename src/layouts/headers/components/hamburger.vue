<script setup>
import { computed } from 'vue'
import { useHeaderStore } from '@/store/header'

const store = useHeaderStore()

const toggleClick = () => {
  store.changeSiderType()
}

const icon = computed(() => {
  return store.siderType ? 'fold' : 'expand'
})
</script>

<template>
  <div
    id="hamburger"
    class="hamburger-container"
    @click="toggleClick"
  >
    <ElIcon>
      <component :is="icon" />
    </ElIcon>
  </div>
</template>

<style lang="scss" scoped>
.hamburger-container {
  margin-right: 16px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>

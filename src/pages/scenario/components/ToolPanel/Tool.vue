<!--
  @name: Tool.vue
  @description: TODO
  @author: Lingkai Shi
  @date: 7/16/2024 9:43 PM
  @version: 1.0
-->

<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

import ResourceDnd from '@/pages/scenario/components/ResourceDnd.vue'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<template>
  <ElTabs
    v-model="activeName"
    class="demo-tabs"
    @tab-click="handleClick"
  >
    <ElTabPane
      label="WordCloud"
      name="first"
    >
      WordCloud
    </ElTabPane>
    <ElTabPane
      label="Map"
      name="second"
    >
      <ResourceDnd />
    </ElTabPane>
    <ElTabPane
      label="Chart"
      name="third"
    >
      Chart
    </ElTabPane>
  </ElTabs>
</template>

<style scoped lang="scss">

</style>

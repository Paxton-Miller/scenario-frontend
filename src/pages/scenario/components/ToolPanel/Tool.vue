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

import ResourceDnd from '@/pages/scenario/components/ToolPanel/ResourceDnd.vue'
import WordCloud from '@/pages/scenario/components/ToolPanel/WordCloud.vue'
import Property from '@/pages/scenario/components/ToolPanel/Property.vue'

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
    <ElTabPane name="first">
      <template #label>
        <span style="font-size: smaller">Property</span>
      </template>
      <Property />
    </ElTabPane>
    <ElTabPane name="second">
      <template #label>
        <span style="font-size: smaller">WordCloud</span>
      </template>
      <WordCloud />
    </ElTabPane>
    <ElTabPane name="third">
      <template #label>
        <span style="font-size: smaller">Map&Chart</span>
      </template>
      <ResourceDnd />
    </ElTabPane>
  </ElTabs>
</template>

<style scoped lang="scss">

</style>

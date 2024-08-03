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

import ResourceDnd from '@/pages/scenario/components/ToolPanel/Resource/ResourceDnd.vue'
import Property from '@/pages/scenario/components/ToolPanel/Property.vue'

import Map from '@/pages/scenario/components/ToolPanel/Map/Map.vue'

// import Map from '@/pages/scenario/components/ToolPanel/MapNode.vue'
import { useGraphPermission } from '@/store/graphPermission'

const activeName = ref('second')
const graphPermissionStore = useGraphPermission()

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
      v-if="graphPermissionStore.isWrite"
      name="first"
    >
      <template #label>
        <span style="font-size: smaller">Property</span>
      </template>
      <Property />
    </ElTabPane>
    <ElTabPane
      v-if="graphPermissionStore.isWrite"
      name="second"
    >
      <template #label>
        <span style="font-size: smaller">Resource</span>
      </template>
      <ResourceDnd />
    </ElTabPane>
    <ElTabPane
      v-if="graphPermissionStore.isWrite"
      name="third"
    >
      <template #label>
        <span style="font-size: smaller">Map</span>
      </template>
      <Map />
    </ElTabPane>
  </ElTabs>
</template>

<style scoped lang="scss">

</style>

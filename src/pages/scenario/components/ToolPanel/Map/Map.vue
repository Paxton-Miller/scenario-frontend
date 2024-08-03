<!--
  @name: Map
  @description: TODO
  @author: Lingkai Shi
  @date: 7/31/2024 10:34 AM
  @version: 1.0
-->

<script setup lang="ts">
import { getTeleport } from '@antv/x6-vue-shape'
import { ref } from 'vue'
import MyMapDialog from '@/pages/scenario/components/ToolPanel/Map/MyMapDialog.vue'
import CustomMapDialog from '@/pages/scenario/components/ToolPanel/Map/CustomMapDialog.vue'
import MapList from '@/pages/scenario/components/ToolPanel/Map/MapList.vue'

const TeleportContainer = getTeleport()

const myMapDialog = ref<boolean>(false)
const customMapDialog = ref<boolean>(false)
const activeName = ref('1')
const myMapListRef = ref()

const handleCloseEdit = async (newInfo: any) => {
  myMapDialog.value = false
}

const handleCloseAdd = () => {
  myMapListRef.value.getTableData()
  customMapDialog.value = false
}
</script>

<template>
  <TeleportContainer />
  <ElCollapse
    v-model="activeName"
    accordion
  >
    <ElCollapseItem name="1">
      <template #title>
        My Map
        <ElIcon
          style="margin: 5px; cursor: pointer;"
          @click="myMapDialog = true"
        >
          <component is="editPen" />
        </ElIcon>
        <ElIcon
          style="margin: 5px; cursor: pointer;"
          @click="customMapDialog = true"
        >
          <component is="plus" />
        </ElIcon>
      </template>
      <MapList
        width="35px"
        height="35px"
        :show-name="false"
        layout="prev, next, jumper"
        ref="myMapListRef"
      />
    </ElCollapseItem>
    <ElCollapseItem
      title="More Map"
      name="2"
    >
      <MapList
        width="35px"
        height="35px"
        :show-name="false"
        :is-restricted="false"
        layout="prev, next, jumper"
      />
    </ElCollapseItem>
  </ElCollapse>
  <MyMapDialog
    v-if="myMapDialog"
    :dialog="myMapDialog"
    @close-add="handleCloseEdit"
  />
  <CustomMapDialog
    v-if="customMapDialog"
    :dialog="customMapDialog"
    @close-add="handleCloseAdd"
  />
</template>

<style scoped lang="scss">
</style>

<!--
  @name: ResourceDnd
  @description: TODO
  @author: Lingkai Shi
  @date: 7/18/2024 11:18 AM
  @version: 1.0
-->

<script setup lang="ts">
import { ref } from 'vue'
import ResourceList from '@/pages/scenario/components/ToolPanel/Resource/ResourceList.vue'
import MyResourceDialog from '@/pages/scenario/components/ToolPanel/Resource/MyResourceDialog.vue'

const myResourceDialog = ref<boolean>(false)
const activeName = ref('1')

const handleCloseAdd = async (newInfo: any) => {
  myResourceDialog.value = false
}
</script>

<template>
  <ElCollapse
    v-model="activeName"
    accordion
  >
    <ElCollapseItem name="1">
      <template #title>
        My Resource
        <ElIcon
          style="margin: 5px; cursor: pointer;"
          @click="myResourceDialog = true"
        >
          <component is="editPen" />
        </ElIcon>
      </template>
      <ResourceList
        width="50px"
        height="50px"
        :show-name="false"
        layout="prev, next, jumper"
      />
    </ElCollapseItem>
    <ElCollapseItem
      title="More Resource"
      name="2"
    >
      <ResourceList
        width="50px"
        height="50px"
        :show-name="false"
        :is-restricted="false"
        layout="prev, next, jumper"
      />
    </ElCollapseItem>
  </ElCollapse>
  <MyResourceDialog
    v-if="myResourceDialog"
    :dialog="myResourceDialog"
    @close-add="handleCloseAdd"
  />
</template>

<style scoped lang="scss">
</style>

<!--
  @name: collaboration
  @description: TODO
  @author: Lingkai Shi
  @date: 7/25/2024 5:17 PM
  @version: 1.0
-->

<script lang="ts" setup>
import { ref } from 'vue'
import CardList from '@/pages/invite-collaboration/components/CardList.vue'

const cardListRef = ref(null)
const queryContent = ref<string>('')

const handleSearch = () => {
  if (cardListRef.value)
    (cardListRef.value as any).handleSearch()
}

const handleClear = () => {
  if (cardListRef.value)
    (cardListRef.value as any).getTableData()
}
</script>

<template>
  <div style="display: flex; justify-content: center;">
    <ElInput
      v-model="queryContent"
      placeholder="Please enter what you want to query"
      clearable
      style="max-width: 40%"
      @clear="handleClear"
    >
      <template #append>
        <ElButton
          icon="search"
          @click="handleSearch"
        />
      </template>
    </ElInput>
  </div>
  <CardList
    ref="cardListRef"
    :query-content="queryContent"
  />
</template>

<style>

</style>

<!--
  @name: Graph.vue
  @description: TODO
  @author: Lingkai Shi
  @date: 7/9/2024 8:53 PM
  @version: 1.0
-->

<script setup lang="ts">
import { ref } from 'vue'
import CardList from '@/pages/project/components/CardList.vue'
import AddDialog from '@/pages/project/components/AddProjectDialog.vue'
import type { AddForm, AddRequest } from '@/pages/project/class/Project'
import { addProject } from '@/api/ProjectApi'
import type { Project } from '@/api/class/Project'

const router = useRouter()
const cardListRef = ref(null)
const queryContent = ref<string>('')
const addDialog = ref<boolean>(false)

const handleSearch = () => {
  if (cardListRef.value)
    (cardListRef.value as any).handleSearch()
}

const handleClear = () => {
  if (cardListRef.value)
    (cardListRef.value as any).getTableData()
}

const handleCloseAdd = async (newInfo: AddForm) => {
  if (newInfo === undefined || newInfo.description === undefined) {
    addDialog.value = false

    return
  }
  const result = await addProject(newInfo as AddRequest) as unknown as Project
  if (result)
    ElMessage.success('Done')
  addDialog.value = false
  handleClear()

  setTimeout(() => {
    const url = router.resolve({ name: 'ProjectDetail', query: { id: result.id } }).href

    window.open(url, '_blank')
  }, 1000)
}
</script>

<template>
  <div style="display: flex; justify-content: center;">
    <ElButton
      icon="plus"
      type="primary"
      @click="addDialog = true"
    >
      New
    </ElButton>
    &nbsp;&nbsp;
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
  <AddDialog
    v-if="addDialog"
    :dialog="addDialog"
    @close-add="handleCloseAdd"
  />
</template>

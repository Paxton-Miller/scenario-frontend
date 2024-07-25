<!--
  @name: CollaboratorTable
  @description: TODO
  @author: Lingkai Shi
  @date: 7/21/2024 7:47 PM
  @version: 1.0
-->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserByIds } from '@/api/UserApi'
import type { GetAllUserResponse } from '@/api/class/User'

const props = defineProps({
  room: {
    default: null,
  },
  showHeader: {
    default: true,
    type: Boolean,
  },
  layout: {
    default: 'total, prev, pager, next, jumper',
    type: String,
  },
})

const userIdList = ref<number[]>()
const userId = localStorage.getItem('id')
const tableData = ref([])
const page = ref<number>(1)
const pageSize = ref<number>(4)
const totalCount = ref<number>(5)

const getTableData = async () => {
  userIdList.value = (props.room as any).collaborator.split(',').filter(Boolean).map(Number)

  const result = await getUserByIds(userIdList.value as number[], page.value, pageSize.value) as unknown as GetAllUserResponse
  if (result) {
    tableData.value = result.list as any
    page.value = result.page
    pageSize.value = result.pageSize
    totalCount.value = result.totalCount
  }
}

const handleSizeChange = async () => {
  await getTableData()
}

const handlePageChange = async () => {
  await getTableData()
}

onMounted(async () => {
  await getTableData()
})
</script>

<template>
  <ElTable
    :data="tableData"
    style="width: 100%"
    :show-header="showHeader"
  >
    <ElTableColumn
      :label="`${userIdList?.length} people have joined the collaboration`"
      min-width="70%"
    >
      <template #default="prop">
        <span
          class="el-avatar el-avatar--circle"
          style="height: 20px; width: 20px; line-height: 20px;"
        >
          <img
            :src="prop.row.avatar"
            style="object-fit: cover;"
          >
        </span>
        {{ prop.row.name }}
      </template>
    </ElTableColumn>
    <ElTableColumn
      label="Management"
      min-width="30%"
    >
      <template #default="prop">
        <ElDropdown
          trigger="click"
          :disabled=" prop.row.id == userId"
        >
          <span class="el-dropdown-link">
            {{ prop.row.id == userId ? 'Creator' : 'Editor' }}
            <ElIcon class="el-icon--right">
              <component is="arrowDown" />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>Editor</ElDropdownItem>
              <ElDropdownItem>Viewer</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </template>
    </ElTableColumn>
  </ElTable>
  <ElPagination
    v-model:current-page="page"
    v-model:page-size="pageSize"
    class="align-right"
    :page-sizes="[4, 5, 8]"
    :layout="layout"
    :total="totalCount"
    @size-change="handleSizeChange"
    @current-change="handlePageChange"
  />
</template>

<style scoped lang="scss">
.align-right {
  display: flex;
  justify-content: flex-end;
}
</style>

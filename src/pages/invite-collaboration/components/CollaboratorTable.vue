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
import type { GetAllUserResponse, User } from '@/api/class/User'
import { editRoomCollaborator, getCollaboratorByRoomId } from '@/api/RoomCollaboratorApi'
import type { RoomCollaborator } from '@/api/class/RoomCollaborator'

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

const userIdList = ref<number[]>([])
const userId = Number.parseInt(localStorage.getItem('id') as string)
const tableData = ref([])
const page = ref<number>(1)
const pageSize = ref<number>(4)
const totalCount = ref<number>(5)

const permissionList = [
  {
    label: 'Creator',
    value: 'admin',
    key: 0,
  },
  {
    label: 'Editor',
    value: 'write',
    key: 1,
  },
  {
    label: 'Viewer',
    value: 'read',
    key: 2,
  },
  {
    label: 'Visitor',
    value: 'none',
    key: 3,
  },
]

const getTableData = async () => {
  // get the information of the collaborators in the room and their rights.
  const collaborators = await getCollaboratorByRoomId(props.room?.id) as unknown as RoomCollaborator[]
  for (const item of collaborators)
    userIdList.value?.push(item.userId)

  // get their details
  const result = await getUserByIds(userIdList.value as number[], page.value, pageSize.value) as unknown as GetAllUserResponse
  if (result) {
    // add each obj a property of permissionLevel(none/admin/write/read)
    for (const value of collaborators) {
      let obj: any = value as any

      const user = result.list.filter(u => (u as any).id === obj.userId)[0] as User
      if (obj.permissionLevel === 'admin')
        obj.permissionLabel = 'Creator'
      else if (obj.permissionLevel === 'write')
        obj.permissionLabel = 'Editor'
      else if (obj.permissionLevel === 'read')
        obj.permissionLabel = 'Viewer'
      else {
        obj.permissionLabel = 'Visitor'
      }
      obj.name = user.name
      obj.avatar = user.avatar


      tableData.value.push(obj)
    }

    /* for (const obj of result.list) {
      (obj as any).permissionLevel = collaborators.filter(colla => colla.userId == (obj as any).id)[0].permissionLevel
      let permissionLabel
      if ((obj as any).permissionLevel === 'admin')
        permissionLabel = 'Creator'
      else if ((obj as any).permissionLevel === 'write')
        permissionLabel = 'Editor'
      else if ((obj as any).permissionLevel === 'read')
        permissionLabel = 'Viewer'
      else {
        permissionLabel = 'Visitor'
      }
      (obj as any).permissionLabel = permissionLabel
      tableData.value.push(obj)
    } */

    page.value = result.page
    pageSize.value = result.pageSize
    totalCount.value = result.totalCount
  }
}

const handleCommand = async (command: number, row: any) => {
  console.log(command)
  console.log(row)

  const permission = permissionList[command]

  row.permissionLevel = permission.value
  row.permissionLabel = permission.label

  const result = await editRoomCollaborator(row) as unknown as RoomCollaborator
  if (result === undefined)
    ElMessage.warning('Operation failed')
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
          :disabled=" prop.row.id === userId"
          @command="handleCommand($event, prop.row)"
        >
          <span class="el-dropdown-link">
            {{ prop.row.permissionLabel }}
            <ElIcon class="el-icon--right">
              <component is="arrowDown" />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="1">
                Editor
              </ElDropdownItem>
              <ElDropdownItem command="2">
                Viewer
              </ElDropdownItem>
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

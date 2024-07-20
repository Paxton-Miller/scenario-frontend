<!--
  @name: LinkDialog
  @description: TODO
  @author: Lingkai Shi
  @date: 7/20/2024 3:52 PM
  @version: 1.0
-->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getRoomByScenarioId } from '@/api/RoomApi'
import type { Room } from '@/api/class/Room'
import { getUserByIds } from '@/api/UserApi'
import type { GetAllUserResponse } from '@/api/class/User'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: true,
  },
  scenarioId: {
    type: Number,
    default: 1,
  },
})

const emits = defineEmits(['closeAdd'])
const tableData = ref([])
const page = ref<number>(1)
const pageSize = ref<number>(5)
const totalCount = ref<number>(5)
const room = ref<Room>()
const userIdList = ref<number[]>()
const userId = localStorage.getItem('id')

const copyLink = () => {
  const link = `http://localhost:8080/invite?roomUUId=${room.value?.uuid}`

  // 创建一个隐藏的 textarea 元素
  const textarea = document.createElement('textarea')

  textarea.value = link

  // 将 textarea 元素添加到 DOM 中
  document.body.appendChild(textarea)

  // 选择 textarea 的内容
  textarea.select()

  try {
    // 执行复制命令
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'

    console.log(`Copying text command was ${msg}`)
  }
  catch (err) {
    console.error('Oops, unable to copy', err)
  }

  // 将 textarea 元素从 DOM 中移除
  document.body.removeChild(textarea)
}

const getTableData = async () => {
  const result1 = await getRoomByScenarioId(props.scenarioId) as unknown as Room
  if (result1) {
    room.value = result1

    userIdList.value = result1.collaborator.split(',').filter(Boolean).map(Number)

    // tableData.value = userIdList.value.map(id => ({ userId: id })) as any
  }
  const result2 = await getUserByIds(userIdList.value as number[], page.value, pageSize.value) as unknown as GetAllUserResponse
  if (result2) {
    tableData.value = result2.list as any
    page.value = result2.page
    pageSize.value = result2.pageSize
    totalCount.value = result2.totalCount
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
  <ElDialog
    :model-value="dialog"
    width="45%"
    :before-close="() => emits('closeAdd')"
  >
    <template #header>
      <span>Invite Collaborators</span>
    </template>

    <ElTable
      :data="tableData"
      style="width: 100%"
    >
      <ElTableColumn
        :label="`${userIdList?.length} people have joined the collaboration`"
        width="500"
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
        width="150"
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
    <template #footer>
      <span>
        Anyone who gets the link can edit the scenario
      </span>
      <ElButton
        type="primary"
        @click="copyLink"
      >
        Copy Invitation Link
      </ElButton>
      <ElButton
        type="primary"
        plain
        @click="() => emits('closeAdd')"
      >
        Cancel
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.align-right {
  display: flex;
  justify-content: flex-end;
}
</style>

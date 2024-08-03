<!--
  @name: LinkDialog
  @description: TODO
  @author: Lingkai Shi
  @date: 7/20/2024 3:52 PM
  @version: 1.0
-->

<script setup lang="ts">
import { ref } from 'vue'
import type { Room } from '@/api/class/Room'
import CollaboratorTable from '@/pages/invite-collaboration/components/CollaboratorTable.vue'
import { editRoom, getRoomByScenarioId } from '@/api/RoomApi'

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

const room = ref<Room>()
const isReady = ref<boolean>(false)
const isLinkWrite = ref<boolean>()

const copyLink = () => {
  const link = `http://localhost:8080/invite?roomUUId=${room.value?.uuid}`
  const textarea = document.createElement('textarea')

  textarea.value = link
  document.body.appendChild(textarea)
  textarea.select()
  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'

    ElMessage.success('copied')
  }
  catch (err) {
    console.error('Oops, unable to copy', err)
  }

  document.body.removeChild(textarea)
}

const getRoom = async () => {
  const result = await getRoomByScenarioId(props.scenarioId) as unknown as Room
  if (result) {
    room.value = result
    isReady.value = true
    isLinkWrite.value = room.value.isLinkWrite
  }
}

const handleChange = () => {
  room.value.isLinkWrite = isLinkWrite.value as boolean

  const result = editRoom(room.value) as unknown as Room
  if (result === undefined)
    ElMessage.warning('Operation failed')
}

onMounted(async () => {
  await getRoom()
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
    <CollaboratorTable
      v-if="isReady"
      :room="room as any"
    />
    <template #footer>
      <span>
        Anyone who gets the link is able to
      </span>
      <ElSwitch
        v-model="isLinkWrite"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: lightblue"
        active-text="edit"
        inactive-text="read"
        @change="handleChange"
      />
      &nbsp;&nbsp;
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

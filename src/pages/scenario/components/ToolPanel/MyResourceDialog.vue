<!--
  @name: MyResourceDialog
  @description: TODO
  @author: Lingkai Shi
  @date: 7/17/2024 2:21 PM
  @version: 1.0
-->

<script setup lang="ts">
import { onMounted } from 'vue'
import { Graph } from '@antv/x6'
import { v4 as uuidv4 } from 'uuid'
import { addResource, uploadResource } from '@/api/ResourceApi'
import ResourceList from '@/pages/scenario/components/ToolPanel/ResourceList.vue'

defineProps({
  dialog: {
    type: Boolean,
    default: true,
  },
  graph: {
    type: Graph,
    default: null,
  },
})

const emits = defineEmits(['closeAdd'])
const listRef = ref()

const handleChange = async (file: File) => {
  if (file.size / 1024 > 200) {
    ElMessage.warning('Must be less than 200k')

    return
  }
  const uploadFormData = new FormData()

  uploadFormData.append('file', (file as any).raw)

  const format = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
  const uuidName = `${uuidv4()}.${format}`
  const url = await uploadResource(uuidName, uploadFormData) as unknown as string

  const resource = {
    name: file.name,

    // size: file.size,
    uuidName,
    url,
    format,
    accessLevel: 'restricted',
    type: 'map',
  }

  if (await (addResource(resource))) {
    listRef.value.getTableData()
    ElMessage.success('Done')
  }
}

onMounted(() => {
})
</script>

<template>
  <ElDialog
    :model-value="dialog"
    width="45%"
    :before-close="() => emits('closeAdd')"
  >
    <template #header>
      <span>My Resource</span>
    </template>
    <ResourceList ref="listRef" />

    <ElUpload
      action=""
      accept=".jpg,.png,.jpeg,.svg,"
      :auto-upload="false"
      class="upload-demo"
      :on-change="handleChange"
      :show-file-list="false"
    >
      <template #trigger>
        <ElTooltip content="jpg,png,svg less than 200k are supported">
          <ElButton type="primary">
            Local Import
          </ElButton>
        </ElTooltip>
      </template>
    </ElUpload>
  </ElDialog>
</template>

<!--
  @name: MyMapDialog
  @description: TODO
  @author: Lingkai Shi
  @date: 8/2/2024 11:21 AM
  @version: 1.0
-->

<script setup lang="ts">
import { Graph } from '@antv/x6'
import { v4 as uuidv4 } from 'uuid'
import { onMounted } from 'vue'
import { addResource, uploadResource } from '@/api/ResourceApi'
import MapList from '@/pages/scenario/components/ToolPanel/Map/MapList.vue'

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

// when getting the local image
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
      <span>My Map</span>
    </template>
    <MapList
      ref="listRef"
      width="100px"
      height="100px"
    />
  </ElDialog>
</template>

<style scoped lang="scss">

</style>

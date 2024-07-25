<script lang="ts" setup>
import { DataUri } from '@antv/x6'
import { ref } from 'vue'
import FlowGraph from '../Graph'
import { saveScenarioGraphJsonByIdAndType } from '@/api/ScenarioApi'
import type { ElementOption } from '@/pages/common/class/ElOption'
import LinkDialog from '@/pages/invite-collaboration/components/LinkDialog.vue'
import { useOnlineEditorStore } from '@/store/onlineEditor'
import { getUserById } from '@/api/UserApi'

const route = useRoute()
const linkDialog = ref<boolean>(false)
const dimension = ref<string>('time')
const store = useOnlineEditorStore()
const user = ref()
const isTimeout = ref<boolean>(true)

defineExpose({
  dimension,
})

const dimensions = ref<ElementOption[]>([
  {
    label: 'Time',
    value: 'time',
  },
  {
    label: 'Space',
    value: 'space',
  },
  {
    label: 'Person',
    value: 'person',
  },
  {
    label: 'Object',
    value: 'object',
  },
  {
    label: 'Event',
    value: 'event',
  },
  {
    label: 'Phenomenon',
    value: 'phenomenon',
  },
])

const handleZoom = (zoomNumber: number) => {
  const { graph } = FlowGraph

  graph?.zoom(zoomNumber)
}

const zoomToFit = () => {
  const { graph } = FlowGraph

  graph?.zoomToFit({
    padding: 20,
    preserveAspectRatio: true,
    maxScale: 1,
  })
}

const saveGraph = async () => {
  const { graph } = FlowGraph

  await saveScenarioGraphJsonByIdAndType(route.query.id as unknown as number, dimension.value, graph?.toJSON())
  ElMessage.success('Done')
}

const toPng = () => {
  const { graph } = FlowGraph

  graph.toPNG(
    (dataUri: string) => {
      // 下载
      DataUri.downloadDataUri(dataUri, '.png')
    },
    {
      backgroundColor: 'white',
      padding: {
        top: 20,
        right: 30,
        bottom: 40,
        left: 50,
      },
      quality: 1,
    },
  )
}

const toJpeg = () => {
  const { graph } = FlowGraph

  graph.toJPEG(
    (dataUri: string) => {
      // 下载
      DataUri.downloadDataUri(dataUri, '.png')
    },
    {
      backgroundColor: 'white',
      padding: {
        top: 20,
        right: 30,
        bottom: 40,
        left: 50,
      },
      quality: 1,
    },
  )
}

const toSvg = () => {
  const { graph } = FlowGraph

  graph.toSVG((dataUri: string) => {
    // 下载
    DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg')
  })
}

const handleCommand = (command: string | number | object) => {
  if (command === 'png')
    toPng()
  else if (command === 'jpeg')
    toJpeg()
  else if (command === 'svg')
    toSvg()
}

const handleCloseAdd = () => {
  linkDialog.value = false
}

watch(() => store.isEditing, async val => {
  if (val === undefined || val === null || val === false)
    return
  const result = await getUserById(store.userId as unknown as number)
  if (result) {
    user.value = result
    isTimeout.value = false
    store.isEditing = false
    setTimeout(() => {
      isTimeout.value = true
    }, 5000)
  }
})
</script>

<template>
  <div class="bar">
    <ElAlert
      v-if="!isTimeout"
      type="success"
      :closable="false"
      style="height: 30px;"
    >
      <template #title>
        <span
          class="el-avatar el-avatar--circle"
          style="height: 20px; width: 20px; line-height: 20px; margin-top: 3px"
        >
          <img
            :src="user?.avatar"
            style="object-fit: cover;"
          >
        </span>
        is editing
      </template>
    </ElAlert>
    <ElSelect
      v-model="dimension"
      style="min-width:170px; margin: 5px"
      placeholder="Choose Dimension"
    >
      <ElOption
        v-for="item in dimensions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </ElSelect>

    <ElTooltip
      placement="bottom"
      content="zoom in"
    >
      <ElIcon
        style="margin: 5px; cursor: pointer;"
        @click="handleZoom(0.1)"
      >
        <component is="zoomIn" />
      </ElIcon>
    </ElTooltip>

    <ElTooltip
      placement="bottom"
      content="zoom out"
    >
      <ElIcon
        style="margin: 5px; cursor: pointer;"
        @click="handleZoom(-0.1)"
      >
        <component is="zoomOut" />
      </ElIcon>
    </ElTooltip>

    <ElTooltip
      placement="bottom"
      content="full screen"
    >
      <ElIcon
        style="margin: 5px; cursor: pointer;"
        @click="zoomToFit"
      >
        <component is="fullScreen" />
      </ElIcon>
    </ElTooltip>
    <ElTooltip
      placement="bottom"
      content="share"
    >
      <ElIcon
        style="margin: 5px; cursor: pointer;"
        @click="linkDialog = true"
      >
        <component is="connection" />
      </ElIcon>
    </ElTooltip>
    <ElTooltip
      placement="bottom"
      content="save"
    >
      <ElIcon
        style="margin: 5px; cursor: pointer;"
        @click="saveGraph"
      >
        <component is="documentChecked" />
      </ElIcon>
    </ElTooltip>
    <ElDropdown @command="handleCommand">
      <ElIcon style="margin: 5px; cursor: pointer;">
        <component is="download" />
      </ElIcon>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem command="png">
            PNG
          </ElDropdownItem>
          <ElDropdownItem command="jpeg">
            JPEG
          </ElDropdownItem>
          <ElDropdownItem command="svg">
            SVG
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
  <LinkDialog
    v-if="linkDialog"
    :dialog="linkDialog"
    :scenario-id="route.query.id as unknown as number"
    @close-add="handleCloseAdd"
  />
</template>

<style lang="less" scoped>
.bar {
  display: flex;
  align-items: center; /* 垂直居中子元素 */
  margin-right: 16px;
}

.item-space {
  margin-left: 16px;
}
</style>

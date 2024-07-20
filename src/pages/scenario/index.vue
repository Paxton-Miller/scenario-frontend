<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import '@/pages/scenario/css/reset/reset.less'
import '@/pages/scenario/css/reset/global.css'
import './css/index.less'
import type { Graph } from '@antv/x6'
import { Pane, Splitpanes } from 'splitpanes'
import FlowGraph from './components/Graph'
import { getScenarioGraphJsonById, saveScenarioGraphJsonById } from '@/api/ScenarioApi'
import 'splitpanes/dist/splitpanes.css'

const route = useRoute()
const graph = ref<Graph>()

const getContainerSize = () => {
  return {
    // change the size of graph container
    width: document.body.offsetWidth - 600,
    height: document.body.offsetHeight - 130,
  }
}

const isReady = ref(false)

const saveGraph = async () => {
  await saveScenarioGraphJsonById(route.query.id as unknown as number, graph.value?.toJSON())
  ElMessage.success('Done')
}

const initGraph = async () => {
  const data = await getScenarioGraphJsonById(route.query.id as unknown as number)
  if (data) {
    graph.value = FlowGraph.init(data)
  } else {
    graph.value = FlowGraph.init({
      cells: [],
    })
  }

  isReady.value = true

  const resizeFn = () => {
    const { width, height } = getContainerSize()

    graph.value?.resize(width, height)
  }

  resizeFn()
  window.addEventListener('resize', resizeFn)

  return () => {
    window.removeEventListener('resize', resizeFn)
  }
}

onMounted(() => {
  initGraph()
})
</script>

<template>
  <div class="wrap">
    <div class="content">
      <Splitpanes class="default-theme" style="height: 400px">
        <!-- 左侧工具栏 -->
        <Pane
          id="stencil"
          class="sider"
        />
        <Pane class="panel">
          <!-- 流程图画板 -->
          <div
            id="container"
            class="x6-graph"
          />
        </Pane>
        <!-- 右侧工具栏 -->
        <Pane class="config">
          <ElButton @click="saveGraph">
            Save
          </ElButton>
          <ChatPanel />
          <ToolPanel />
          <!--        <ConfigPanel v-if="isReady" /> -->
        </Pane>
      </Splitpanes>
    </div>
  </div>
</template>

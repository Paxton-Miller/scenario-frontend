<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import './reset/reset.less'
import './reset/global.css'
import './index.less'
import type { Graph } from '@antv/x6'
import FlowGraph from './graph'
import { getScenarioGraphJsonById, saveScenarioGraphJsonById } from '@/api/ScenarioApi'

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

  graph.value = FlowGraph.init(data)

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
      <!-- 左侧工具栏 -->
      <div
        id="stencil"
        class="sider"
      />
      <div class="panel">
        <!-- 流程图画板 -->
        <div
          id="container"
          class="x6-graph"
        />
      </div>
      <!-- 右侧工具栏 -->
      <div class="config">
        <ElButton @click="saveGraph">
          Save
        </ElButton>
        <!--        <ConfigPanel v-if="isReady" /> -->
      </div>
    </div>
  </div>
</template>

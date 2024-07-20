<!--
  @name: scenario
  @description: TODO
  @author: Lingkai Shi
  @date: 7/11/2024 4:41 PM
  @version: 1.0
-->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import type { Graph } from '@antv/x6'
import FlowGraph from './components/Graph'
import ToolBar from './components/ToolBar/index.vue'
import ChatPanel from '@/pages/scenario/components/ChatPanel/Chat.vue'
import ToolPanel from '@/pages/scenario/components/ToolPanel/Tool.vue'
import AccessDenied from '@/pages/common/[...accessDenied].vue'
import type { Scenario } from '@/api/class/Scenario'
import { getScenarioById, getScenarioGraphJsonById } from '@/api/ScenarioApi'
import '@/pages/scenario/css/reset/reset.less'
import '@/pages/scenario/css/reset/global.css'
import './css/index.less'
import 'splitpanes/dist/splitpanes.css'
import { getRoomByScenarioId } from '@/api/RoomApi'
import type { Room } from '@/api/class/Room'

const route = useRoute()
const scenario = ref<Scenario>()
const graph = ref<Graph>()
const room = ref<Room>()
const isAlreadyACollaborator = ref<boolean>(true)

const checkIdentity = async () => {
  // Check if the user is the collaborator of the scenario?
  const result = await getRoomByScenarioId(route.query.id as unknown as number) as unknown as Room
  if (result)
    room.value = result
  const regex = new RegExp(`(^|,)${localStorage.getItem('id') as number}(,|$)`)
  if (!regex.test(room.value?.collaborator as string))
    isAlreadyACollaborator.value = false
}

const getContainerSize = () => {
  return {
    // change the size of graph container
    width: document.body.offsetWidth - 600,
    height: document.body.offsetHeight - 130,
  }
}

const isReady = ref(false)

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

const getScenarioDetail = async () => {
  scenario.value = await getScenarioById(route.query.id as unknown as number) as unknown as Scenario
}

onMounted(async () => {
  await checkIdentity()
  initGraph()
  await getScenarioDetail()
  console.log(scenario.value)
})
</script>

<template>
  <!-- 最上方一栏ElHeader -->
  <div
    v-if="isAlreadyACollaborator"
    style="display: flex; align-items: center; justify-content: space-between;"
  >
    <div>
      <h3 style="margin-bottom: 5px">
        {{ scenario?.name }} -- Collaborative Communication
      </h3>
    </div>
    <!-- 流程图工具栏 -->
    <div class="toolbar">
      <ToolBar v-if="true" />
    </div>
  </div>
  <AccessDenied v-if="!isAlreadyACollaborator" />
  <div
    v-if="isAlreadyACollaborator"
    class="wrap"
  >
    <div class="content">
      <!-- 左侧图形库Stencil -->
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
        <Splitpanes horizontal>
          <Pane
            min-size="20"
            max-size="70"
          >
            <ChatPanel />
          </Pane>
          <Pane
            min-size="20"
            max-size="70"
          >
            <ToolPanel />
          </Pane>
        </Splitpanes>

        <!--        <ConfigPanel v-if="isReady" /> -->
      </div>
    </div>
  </div>
</template>

<style>
.splitpanes--vertical > .splitpanes__splitter {
  min-width: 2px;
  background: linear-gradient(90deg, #ccc, #555);
}

.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 2px;
  background: linear-gradient(0deg, #ccc, #555);
}
</style>

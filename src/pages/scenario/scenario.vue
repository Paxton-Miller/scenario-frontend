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
import { getScenarioById, getScenarioGraphJsonByIdAndType } from '@/api/ScenarioApi'
import '@/pages/scenario/css/reset/reset.less'
import '@/pages/scenario/css/reset/global.css'
import './css/index.less'
import 'splitpanes/dist/splitpanes.css'
import { getRoomByScenarioId } from '@/api/RoomApi'
import type { Room } from '@/api/class/Room'
import { initWebSocket, onClose, sendMessagePing } from '@/pages/scenario/components/Collaborate'
import { useDimensionStore } from '@/store/dimension'

// const ws = ref(null)

const route = useRoute()
const scenario = ref<Scenario>()
// const graph = ref<Graph>()
const room = ref<Room>()
const isAlreadyACollaborator = ref<boolean>(true)
const isReady = ref(false)
const toolBarRef = ref()
const chatRef = ref()
const store = useDimensionStore()
const isFirstTime = ref<boolean>(true)
const drawer = ref<boolean>(false)

const getRoom = async () => {
  const result = await getRoomByScenarioId(scenario.value?.id as number) as unknown as Room
  if (result)
    room.value = result
}

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

const initGraph = async () => {
  const data = await getScenarioGraphJsonByIdAndType(route.query.id as unknown as number, toolBarRef.value.dimension)
  if (data) {
    // graph.value = FlowGraph.init(data)
    FlowGraph.graph = FlowGraph.init(data)
  } else {
    // graph.value = FlowGraph.init({
    //   cells: [],
    // })
    FlowGraph.graph = FlowGraph.init({
      cells: [],
    })
  }

  const resizeFn = () => {
    const { width, height } = getContainerSize()

    // graph.value?.resize(width, height)
    FlowGraph.graph.resize(width, height)
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
  if (isAlreadyACollaborator.value) {
    await getScenarioDetail()
    await getRoom()
    store.roomUUID = room.value?.uuid
    isReady.value = true
    await initGraph()
    isFirstTime.value = false
    initWebSocket(room.value?.uuid as string, 'time')
    setInterval(() => {
      // heartbeats 60s per time
      sendMessagePing()
    }, 1000 * 60)
    store.scenarioId = <number>scenario.value?.id
  }
})

onBeforeUnmount(() => {
  onClose()
})
watch(() => toolBarRef.value?.dimension, async val => {
  store.type = 'time'
  if (!isFirstTime.value) {
    store.type = val
    // do reset the graph when changing the dimension
    // tips: removeCells/clearCells didn't work
    const container = document.getElementById('container')
    if (container)
      container.innerHTML = ''

    await initGraph()

    initWebSocket(route.query.roomUUID as string, val)
  }
})
</script>

<template>

  <!-- Header -->
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
      <ToolBar
        v-if="true"
        ref="toolBarRef"
      />
    </div>
  </div>
  <AccessDenied v-if="!isAlreadyACollaborator" />
  <div
    v-if="isAlreadyACollaborator"
    class="wrap"
  >
    <div class="content">
      <!-- Left Stencil -->
      <div
        id="stencil"
        class="sider"
      />
      <div class="panel">
        <!-- FlowGraph Panel -->
        <div
          id="container"
          class="x6-graph"
        />
      </div>
      <!-- Right ToolPanel -->
      <div class="config">
        <Splitpanes horizontal>
          <Pane
            min-size="20"
            max-size="70"
          >
            <ChatPanel
              v-if="isReady"
              ref="chatRef"
              :scenario-id="scenario?.id"
              :room="room"
            />
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

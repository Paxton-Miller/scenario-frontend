<!--
  @name: ProjectGraph
  @description: TODO
  @author: Lingkai Shi
  @date: 7/11/2024 5:31 PM
  @version: 1.0
-->


<script setup lang="ts">
import { Graph } from '@antv/x6'
import { DeleteFilled, FolderOpened } from '@element-plus/icons-vue'
import { Snapline } from '@antv/x6-plugin-snapline'
import { useContextMenuStore } from '@/store/contextMenu'

// 引入对齐线
import type { Project } from '@/api/class/Project'
import { getProjectById } from '@/api/ProjectApi'
import { ContextMenuTool } from '@/pages/common/components/ContextMenuTool'

const graph = ref<Graph>()
const route = useRoute()
const project = ref<Project>()
const router = useRouter()
const store = useContextMenuStore()

const graphData = ref({
  nodes: [
    {
      id: 1,
      x: 0,
      y: 0,
      shape: 'rect',
      width: 80,
      height: 40,
      label: 'hello',
      ports: [
        {
          id: 'out1',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
            },
          },
        },
        {
          id: 'out2',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
            },
          },
        },
      ],
    },
    {
      id: 2,
      x: 160,
      y: 180,
      width: 80,
      height: 40,
      label: 'world',
    },
  ],
  edges: [
    {
      source: 1,
      target: 2,
      label: 'derive',
    },
  ],
})

const handleZoom = (zoomNumber: number) => {
  graph.value?.zoom(zoomNumber)
}

const zoomToFit = () => {
  graph.value?.zoomToFit({
    padding: 20,
    preserveAspectRatio: true,
    maxScale: 1,
  })
}

const addNode = () => {
  graph.value?.addNode({
    label: 'untitled',
    shape: 'rect',
    x: document.getElementById('container')!.offsetWidth / 2 - 100,
    y: document.getElementById('container')!.offsetHeight / 2 - 50,
    width: 80,
    height: 40,
  })
}

const addEdge = () => {
  graph.value?.addEdge({
    source: 1,
    target: 2,
    label: 'edge',
  })
}

const getProjectDetail = async () => {
  // get project by id
  const result = await getProjectById(route.query.id as unknown as number) as unknown as Project
  if (result)
    project.value = result
}

const registerNode = () => {
  Graph.registerNode( // 设置节点基础样式
    'custom-rect',
    {
      inherit: 'rect',
      width: 200,
      height: 40,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      text: {
        fontSize: 12,
        fill: '#262626',
      },
    },
    true,
  )
}

const configRemove = () => {
  graph.value?.on('node:mouseenter', ({ node }) => {
    /* node.addTools({
      name: 'button-remove',
      args: {
        x: 0,
        y: 0,
        offset: { x: 10, y: 10 },
      },
    }) */
    node.addTools({
      name: 'contextmenu',
      args: {
        menu: [
          {
            label: 'Detail',
            onClick: () => {
              const url = router.resolve({ name: 'Scenario', query: { id: 1 } }).href

              window.open(url, '_blank')
            },
            icon: FolderOpened,
          },
          {
            label: 'Delete',
            onClick: () => {
              // 调用store里记录的，删除节点
              store.e.stopPropagation()
              store.view.cell.remove()
              console.log(graph.value?.getNodes()[0]?.id, graph.value?.toJSON())
            },
            icon: DeleteFilled,
          },
        ],
      },
    })
  })
  graph.value?.on('node:mouseleave', ({ node }) => {
    node.removeTools()
  })
}

const initGraph = () => {
  graph.value = new Graph({
    container: document.getElementById('container') as HTMLElement,
    width: 900,
    height: 520,
    autoResize: true,
    background: { // 背景
      color: '#F2F7FA',
    },
    panning: {
      enabled: true, // 支持滚动放大缩小
    },
    mousewheel: {
      enabled: true,
      modifiers: 'Ctrl', // 按住ctrl按键滚动鼠标滚轮缩放
      factor: 1.1,
      maxScale: 10, // 最大放大
      minScale: 0.05, // 最小缩小
    },
    grid: {
      visible: true, // 渲染网格背景
      type: 'doubleMesh',
      args: [
        {
          color: '#eee', // 主网格线颜色
          thickness: 1, // 主网格线宽度
        },
        {
          color: '#ddd', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4, // 主次网格线间隔
        },
      ],
    },
  })
  graph.value.use( // 启用对齐线
    new Snapline({
      enabled: true,
    }),
  )
  graph.value.on('edge:mouseenter', ({ e, edge, view }) => {
    edge.attr({
      line: {
        stroke: 'red',
        strokeWidth: 3,
      },
    })
  })

  // 鼠标移出线
  graph.value.on('edge:mouseleave', ({ edge }) => {
    edge.attr({
      line: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
      },
    })
  })

  configRemove()
  graph.value.fromJSON(graphData.value)
}

onBeforeMount(() => {
  Graph.registerNodeTool('contextmenu', ContextMenuTool, true)
  registerNode()
})

onMounted(async () => {
  await getProjectDetail()
  initGraph()
})
</script>

<template>
  <ElRow>
    <ElCol>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="display: inline-block">
            {{ project?.name }}
          </h3>
          <ElButton
            icon="plus"
            style="margin: 5px"
            type="primary"
            size="small"
            @click="addNode"
          >
            New Scenario
          </ElButton>
          <ElButton
            icon="plus"
            style="margin: 5px"
            type="primary"
            size="small"
            @click="addEdge"
          >
            New Connector
          </ElButton>
        </div>
        <div>
          <ElButton
            icon="folderChecked"
            style="margin: 5px"
            type="primary"
            size="small"
            @click="addEdge"
          >
            Save
          </ElButton>
          <ElIcon
            style="margin: 5px; cursor: pointer;"
            @click="handleZoom(0.1)"
          >
            <component is="zoomIn" />
          </ElIcon>
          <ElIcon
            style="margin: 5px; cursor: pointer;"
            @click="handleZoom(-0.1)"
          >
            <component is="zoomOut" />
          </ElIcon>
          <ElIcon
            style="margin: 5px; cursor: pointer;"
            @click="zoomToFit"
          >
            <component is="fullScreen" />
          </ElIcon>
        </div>
      </div>
    </ElCol>
  </ElRow>

  <div style="display: flex;justify-content: center">
    <div id="container" />
  </div>
</template>

<style scoped lang="scss">
.align-right {
  display: flex;
  justify-content: right;
}
</style>

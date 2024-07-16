<!--
  @name: ProjectGraph
  @description: TODO
  @author: Lingkai Shi
  @date: 7/11/2024 5:31 PM
  @version: 1.0
-->

<script setup lang="ts">
import type { Cell } from '@antv/x6'
import { Graph } from '@antv/x6'
import { DeleteFilled, FolderOpened, Refresh } from '@element-plus/icons-vue'
import { Snapline } from '@antv/x6-plugin-snapline'
import { ref } from 'vue'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { Selection } from '@antv/x6-plugin-selection'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { History } from '@antv/x6-plugin-history'
import { Transform } from '@antv/x6-plugin-transform'
import { ElMessageBox } from 'element-plus'
import { useContextMenuStore } from '@/store/contextMenu'

import type { Project } from '@/api/class/Project'
import { getProjectById } from '@/api/ProjectApi'
import { ContextMenuTool } from '@/pages/common/components/ContextMenuTool'
import AddConnectorDialog from '@/pages/project/components/AddConnectorDialog.vue'
import type { AddConnectorForm } from '@/pages/project/class/Project'
import {
  batchAddScenario,
  batchDelScenario,
  batchEditScenario,
  getAllScenarioByProjectId,
} from '@/api/ScenarioApi'
import {
  batchAddScenarioRelation,
  batchDelScenarioRelation,
  batchEditScenarioRelation, getAllScenarioRelationByProjectId,
} from '@/api/ScenarioRelationApi'
import type { Scenario } from '@/api/class/Scenario'
import type { ScenarioRelation } from '@/api/class/ScenarioRelation'

const graph = ref<Graph>()
const route = useRoute()
const project = ref<Project>()
const router = useRouter()
const store = useContextMenuStore()
const addConnectorDialog = ref<boolean>(false)
const addNodeTime = ref<number>(0)
const graphNodes = ref()
const graphEdges = ref()
const graphEdgesWithoutId = ref()
const latestNodes = ref<Cell[]>([])
const latestEdges = ref<Cell[]>([])
const canUndo = ref(true)
const canRedo = ref(false)

const history = new History({
  enabled: true,
})

const Undo = () => {
  history.undo()
}

const Redo = () => {
  history.redo()
}

const graphData = ref({
  nodes: [] as Scenario[],
  edges: [] as ScenarioRelation[],
})

const getGraphData = async () => {
  graphNodes.value = await getAllScenarioByProjectId(project.value?.id as number) as unknown as Scenario[]
  graphEdges.value = await getAllScenarioRelationByProjectId(project.value?.id as number) as unknown as ScenarioRelation[]

  graphEdgesWithoutId.value = graphEdges.value.map((edge: any) => {
    // remove the id property
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...edgeWithoutId } = edge

    return edgeWithoutId
  })

  graphData.value.edges = graphEdgesWithoutId.value
  graphData.value.nodes = graphNodes.value
}

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
  addNodeTime.value++
  graph.value?.addNode({
    label: 'untitled',
    shape: 'rect',
    x: document.getElementById('container')!.offsetWidth / 2 - 100 + addNodeTime.value * 15,
    y: document.getElementById('container')!.offsetHeight / 2 - 50 + addNodeTime.value * 10,
    width: 80,
    height: 40,
  })
}

const getProjectDetail = async () => {
  // get project by id
  const result = await getProjectById(route.query.id as unknown as number) as unknown as Project
  if (result)
    project.value = result
}

const registerNode = () => {
  Graph.registerNode( // set the style of node
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

const openNodeDetail = (node: any) => {
  // eslint-disable-next-line
  if (isNaN(node.id)) {
    ElMessage.info('Please save first')
  }
  else {
    const url = router.resolve({ name: 'Scenario', query: { id: node.id } }).href

    window.open(url, '_blank')
  }
}

const deleteCell = () => {
  // use variables recorded in store to delete cell
  store.e.stopPropagation()
  store.view?.cell.remove()
  console.log(graph.value?.getNodes()[0]?.id, graph.value?.toJSON())
}

const renameCell = () => {
  ElMessageBox.prompt('Please rename the cell', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
    .then(({ value }) => {
      store.e.stopPropagation()
      if (store.view?.cell.shape === 'rect')
        (store.view?.cell as any).setLabel(value === null ? '' : value)
      else
        (store.view?.cell as any).setLabels([{ attrs: { label: { text: value === null ? '' : value } } }])

      // store.view?.cell.setLabels([value === null ? '' : value])
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Rename canceled',
      })
    })
}

const configureEvents = () => {
  // configure the node:mouseenter event to generate contextmenu
  graph.value?.on('node:mouseenter', ({ node }) => {
    node.addTools({
      name: 'contextmenu',
      args: {
        menu: [
          {
            label: 'Detail',
            onClick: () => {
              openNodeDetail(node)
            },
            icon: FolderOpened,
          },
          {
            label: 'Rename',
            onClick: renameCell,
            icon: Refresh,
          },
          {
            label: 'Delete',
            onClick: deleteCell,
            icon: DeleteFilled,
          },
        ],
      },
    })
  })
  graph.value?.on('node:mouseleave', ({ node }) => {
    node.removeTools()
  })

  graph.value?.on('node:dblclick', ({ node }) => {
    openNodeDetail(node)
  })

  // configure the edge:mouseenter event to generate contextmenu
  graph.value?.on('edge:mouseenter', ({ edge }) => {
    edge.addTools({
      name: 'contextmenu',
      args: {
        menu: [
          {
            label: 'Rename',
            onClick: renameCell,
            icon: Refresh,
          },
          {
            label: 'Delete',
            onClick: deleteCell,
            icon: DeleteFilled,
          },
        ],
      },
    })
  })
  graph.value?.on('edge:mouseleave', ({ edge }) => {
    edge.removeTools()
  })

  // configure the edge:mouseenter/mouseleave event to set its style
  graph.value?.on('edge:mouseenter', ({ edge }) => {
    edge.attr({
      line: {
        stroke: 'lightblue',
        strokeWidth: 3,
      },
    })
  })
  graph.value?.on('edge:mouseleave', ({ edge }) => {
    edge.attr({
      line: {
        stroke: 'rgb(51, 51, 51)',
        strokeWidth: 2,
      },
    })
  })

  // listen to undo and redo
  graph.value?.on('history:change', () => {
    canUndo.value = history.canUndo()
    canRedo.value = history.canRedo()
  })
}

const initGraph = () => {
  graph.value = new Graph({
    container: document.getElementById('container') as HTMLElement,
    width: 900,
    height: 520,
    autoResize: true,
    background: {
      color: '#F2F7FA',
    },
    panning: {
      enabled: true,
    },
    mousewheel: {
      enabled: true,
      modifiers: 'Ctrl', // Press ctrl to zoom in/out
      factor: 1.1,
      maxScale: 10,
      minScale: 0.05,
    },
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee',
          thickness: 1,
        },
        {
          color: '#ddd',
          thickness: 1,
          factor: 4,
        },
      ],
    },
  })

  // use Snapline
  graph.value.use(
    new Snapline({
      enabled: true,
    }),
  )

  // use Clipboard
  graph.value.use(
    new Clipboard({
      enabled: true,
    }),
  )

  // use Selection
  graph.value.use(
    new Selection({
      enabled: true,
      showNodeSelectionBox: true,
    }),
  )

  // use undo and redo
  graph.value.use(history)

  // use Transform
  graph.value.use(
    new Transform({
      resizing: {
        enabled: true,
      },
      rotating: {
        enabled: false, // 暂时禁用旋转
      },
    }),
  )

  // use hot keys
  graph.value.use(
    new Keyboard({
      enabled: true,
      global: true,
    }),
  )
  graph.value.bindKey('ctrl+c', () => {
    const cells = graph.value?.getSelectedCells()
    if (cells?.length)
      graph.value?.copy(cells)

    return false
  })
  graph.value.bindKey('ctrl+x', () => {
    const cells = graph.value?.getSelectedCells()
    if (cells?.length)
      graph.value?.cut(cells)

    return false
  })
  graph.value.bindKey('backspace', () => {
    const cells = graph.value?.getSelectedCells()
    if (cells?.length)
      graph.value?.removeCells(cells)

    return false
  })

  graph.value.bindKey('ctrl+v', () => {
    if (!graph.value?.isClipboardEmpty()) {
      const cells = graph.value?.paste({ offset: 32 })

      graph.value?.cleanSelection()
      if (cells?.length)
        graph.value?.select(cells)
    }

    return false
  })
  graph.value.bindKey('ctrl+z', () => {
    Undo()

    return false
  })
  graph.value.bindKey('ctrl+y', () => {
    Redo()

    return false
  })

  configureEvents()
  graph.value.fromJSON(graphData.value as any)
}

const handleCloseAdd = async (newInfo: AddConnectorForm) => {
  if (newInfo === undefined || newInfo.target_id === undefined) {
    addConnectorDialog.value = false

    return
  }

  /* eslint-disable */
  (graph.value as any).addEdge({
    source: newInfo.source_id,
    target: newInfo.target_id,
    label: newInfo.label,
    sourceTag: isNaN(newInfo.source_id as any) ? 'new' : 'old', // 根据其是不是字符串判定新旧，新创建的一般由graph自动分配uuid，旧的是数据库查询的自增id
    targetTag: isNaN(newInfo.target_id as any) ? 'new' : 'old',
  })
  /* eslint-disable */
  addConnectorDialog.value = false
}

const renewGraph = async () => {
  await getGraphData()
  graph.value?.fromJSON(graphData.value as any)
}

const saveGraph = async () => {
  const nodesToAdd = []
  const nodesToEdit = []
  const nodesToDel = []
  const edgesToAdd = []
  const edgesToEdit = []
  const edgesToDel = []

  const cells = graph.value?.toJSON().cells

  latestNodes.value = []
  latestEdges.value = []
  for (let i = 0; i < cells!.length; i++) {
    if (cells![i].shape === 'rect')
      latestNodes.value.push(cells![i] as any)
    else
      latestEdges.value.push(cells![i] as any)
  }
  for (let nodeValue of latestNodes.value) {
    // collect the nodes to add
    if (!graphNodes.value.some((node: any) => node.id == nodeValue.id)) {
      nodesToAdd.push({
        node: nodeValue.id,
        label: nodeValue.attrs!.text.text,
        projectId: project.value?.id,
        x: (nodeValue as any).position.x,
        y: (nodeValue as any).position.y,
        width: (nodeValue as any).size.width,
        height: (nodeValue as any).size.height,
      })
    }

    // collect the nodes to edit
    for (const node of graphNodes.value) {
      if (node.id == nodeValue.id) {
        nodesToEdit.push({
          id: node.id,
          label: nodeValue.attrs!.text.text,
          projectId: project.value?.id,
          x: (nodeValue as any).position.x,
          y: (nodeValue as any).position.y,
          width: (nodeValue as any).size.width,
          height: (nodeValue as any).size.height,
        })
      }
    }
  }

  // collect the nodes to delete
  for (const originalNode of graphNodes.value) {
    if (!latestNodes.value.some(node => node.id == originalNode.id))
      nodesToDel.push(originalNode.id)
  }

  const nodesAdded = await batchAddScenario(nodesToAdd) as unknown as Scenario[]

  await batchEditScenario(nodesToEdit)
  await batchDelScenario(nodesToDel)
  for (let edgeValue of latestEdges.value) {
    // collect the edges to add
    if (!graphEdges.value.some((edge: any) => edge.source == (edgeValue as any).source.cell && edge.target == (edgeValue as any).target.cell)) {
      edgesToAdd.push({
        label: (edgeValue as any).labels === undefined ? '' : (edgeValue as any).labels[0].attrs.label.text,
        projectId: project.value?.id,

        // According to the sourceTag created before, if the edge is newly-created, we'll find the element in nodesAdded that uuid(node.node) === edge.source/target.cell. And if the edge already existed before, use source/target.cell instead.
        source: (edgeValue as any).sourceTag === 'new' ? nodesAdded.find(node => node.node === (edgeValue as any).source.cell)?.id : (edgeValue as any).source.cell,
        target: (edgeValue as any).targetTag === 'new' ? nodesAdded.find(node => node.node === (edgeValue as any).target.cell)?.id : (edgeValue as any).target.cell,
      })
    }

    // collect the edges to edit
    for (const edge of graphEdges.value) {
      if (edge.source == (edgeValue as any).source.cell && edge.target == (edgeValue as any).target.cell) {
        edgesToEdit.push({
          id: edge.id,
          label: (edgeValue as any).labels === undefined ? '' : (edgeValue as any).labels[0].attrs.label.text,
          projectId: project.value?.id,
          source: (edgeValue as any).source.cell,
          target: (edgeValue as any).target.cell,
        })
      }
    }
  }

  // collect the edges to delete
  for (const originalEdge of graphEdges.value) {
    if (!latestEdges.value.some((edge: any) => edge.source.cell == originalEdge.source && edge.target.cell == originalEdge.target))
      edgesToDel.push(originalEdge.id)
  }

  await batchAddScenarioRelation(edgesToAdd)
  await batchEditScenarioRelation(edgesToEdit)
  await batchDelScenarioRelation(edgesToDel)
  renewGraph()
  ElMessage.success('Done')
}

onBeforeMount(() => {
  Graph.registerNodeTool('contextmenu', ContextMenuTool, true)
  Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
  registerNode()
})

onMounted(async () => {
  await getProjectDetail()
  await getGraphData()
  initGraph()
})
</script>

<template>
  <ElRow>
    <ElCol>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="display: inline-block">
            {{ project?.name }} -- Project Detail
          </h3>
          &nbsp;
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
            @click="addConnectorDialog = true"
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
            @click="saveGraph"
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
  <span style="color: #5a5e66">Hotkey Tips:&nbsp;&nbsp;Ctrl+Z/Y to undo/redo your changes;&nbsp;&nbsp;Ctrl+C/V/X to copy/paste/cut elements;&nbsp;&nbsp;Backspace to delete elements;</span>
  <AddConnectorDialog
    v-if="addConnectorDialog"
    :dialog="addConnectorDialog"
    :graph="graph"
    @close-add="handleCloseAdd"
  />
</template>

<style scoped lang="scss">
.align-right {
  display: flex;
  justify-content: right;
}
</style>

import { FunctionExt, Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import './shape'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { Selection } from '@antv/x6-plugin-selection'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { History } from '@antv/x6-plugin-history'
import { Transform } from '@antv/x6-plugin-transform'
import { Export } from '@antv/x6-plugin-export'
import { DeleteFilled, Refresh } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ContextMenuTool } from '@/pages/common/components/ContextMenuTool'
import { useContextMenuStore } from '@/store/contextMenu'
import { sendMsg } from '@/pages/scenario/components/Collaborate'
import { saveScenarioGraphJsonByIdAndType } from '@/api/ScenarioApi'
import { useDimensionStore } from '@/store/dimension'
import { useCellPropertyStore } from '@/store/cellProperty'
import { useGraphPermission } from '@/store/graphPermission'

const history = new History({
  enabled: true,
})

const store = useContextMenuStore()
const cellPropertyStore = useCellPropertyStore()
const dimensionStore = useDimensionStore()
const canUndo = ref(true)
const canRedo = ref(false)
const graphPermissionStore = useGraphPermission()

const deleteCell = () => {
  // use variables recorded in store to delete cell
  store.e.stopPropagation()
  store.view?.cell.remove()
}

const renameCell = () => {
  ElMessageBox.prompt('Please rename the cell', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
    .then(({ value }) => {
      store.e.stopPropagation()
      if (store.view?.cell.shape === 'edge')
        (store.view?.cell as any).setLabels([{ attrs: { label: { text: value === null ? '' : value } } }])
      else
        (store.view?.cell as any).setLabel(value === null ? '' : value)

      // store.view?.cell.setAttrs({ text: { text: value === null ? '' : value } })

      // store.view?.cell.setLabels([value === null ? '' : value])
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Rename canceled',
      })
    })
}

export const saveGraph = async () => {
  const { graph } = FlowGraph

  const result = await saveScenarioGraphJsonByIdAndType(dimensionStore.scenarioId, dimensionStore.type as string, graph.toJSON())
  if (!result)
    ElMessage.warning('Auto save failed')
}

const menuTool = {
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
}

export default class FlowGraph {
  public static graph: Graph
  private static stencil: Stencil

  public static init(data: any) {
    this.graph = new Graph({
      container: document.getElementById('container') as HTMLElement,
      width: 800,
      height: 520,
      autoResize: false,
      grid: {
        size: 10,
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
      interacting: {
        nodeMovable: graphPermissionStore.isWrite,
        edgeMovable: graphPermissionStore.isWrite,
        edgeLabelMovable: graphPermissionStore.isWrite,
        vertexAddable: graphPermissionStore.isWrite,
        vertexDeletable: graphPermissionStore.isWrite,
        vertexMovable: graphPermissionStore.isWrite,
        magnetConnectable: graphPermissionStore.isWrite,
        arrowheadMovable: graphPermissionStore.isWrite,
      },
      mousewheel: {
        enabled: graphPermissionStore.isWrite,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 5,
      },
      panning: {
        enabled: true,
      },
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        highlight: true,
        snap: true,
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#5F95FF',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 8,
                },
              },
            },
            router: {
              name: 'manhattan',
            },
            zIndex: 0, // Attention! Do set the zIndex of edge as 0 so that the port of the node will be available to link multiple nodes.
          })
        },
        validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet }) {
          return !(sourceView === targetView || !sourceMagnet || !targetMagnet)
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: 'rgba(223,234,255)',
            },
          },
        },
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()

          return this.getNodes().filter(n => {
            // 只有 d.parent 为 true 的节点才是父节点
            const d = n.getData<any>()
            if (d && d.parent) {
              const targetBBox = n.getBBox()

              return bbox.isIntersectWithRect(targetBBox)
            }

            return false
          })
        },
      },
    })
    this.graph?.clearCells()
    if (graphPermissionStore.isWrite)
      this.initAddon()

    this.initStencil()
    this.initShape()
    this.initGraphShape(data)
    this.initEvent()

    return this.graph
  }

  private static initAddon() {
    // use Snapline
    this.graph.use(
      new Snapline({
        enabled: true,
      }),
    )

    // use Clipboard
    this.graph.use(
      new Clipboard({
        enabled: true,
      }),
    )

    // use Selection
    this.graph.use(
      new Selection({
        enabled: true,
        showNodeSelectionBox: true,
      }),
    )

    // use undo and redo
    this.graph.use(history)

    // use Transform
    this.graph.use(
      new Transform({
        resizing: {
          enabled: true,
        },
        rotating: {
          enabled: false, // 暂时禁用旋转
        },
      }),
    )

    this.graph.use(new Export())

    // use hot keys
    this.graph.use(
      new Keyboard({
        enabled: true,
        global: true,
      }),
    )
    this.graph.bindKey('ctrl+c', () => {
      const cells = this.graph?.getSelectedCells()
      if (cells?.length)
        this.graph?.copy(cells)

      return false
    })
    this.graph.bindKey('ctrl+x', () => {
      const cells = this.graph?.getSelectedCells()
      if (cells?.length)
        this.graph?.cut(cells)

      return false
    })
    this.graph.bindKey('backspace', () => {
      const cells = this.graph?.getSelectedCells()
      if (cells?.length)
        this.graph?.removeCells(cells)

      return false
    })

    this.graph.bindKey('ctrl+v', () => {
      if (!this.graph?.isClipboardEmpty()) {
        const cells = this.graph?.paste({ offset: 32 })

        this.graph?.cleanSelection()
        this.graph?.select(cells)
      }

      return false
    })
    this.graph.bindKey('ctrl+z', () => {
      history.undo()

      return false
    })
    this.graph.bindKey('ctrl+y', () => {
      history.redo()

      return false
    })
  }

  private static initStencil() {
    this.stencil = new Stencil({
      target: this.graph,
      stencilGraphWidth: 280,
      search: { rect: true },
      collapsable: true,
      groups: [
        {
          name: 'basic',
          title: 'Basic Nodes',
          graphHeight: 180,
        },
        {
          name: 'combination',
          title: 'Combined Nodes',
          layoutOptions: {
            columns: 1,
            marginX: 60,
          },
          graphHeight: 260,
        },
        {
          name: 'text',
          title: 'Text Nodes',
          layoutOptions: {
            columns: 1,
            marginX: 50,
          },
          graphHeight: 240,
        },
        {
          name: 'group',
          title: 'Node Group',
          graphHeight: 100,
          layoutOptions: {
            columns: 1,
            marginX: 60,
          },
        },
      ],

      // set the node isDrag depending on isWrite
      getDragNode: graphPermissionStore.isWrite ? node => node.clone() : () => null,
    })

    const stencilContainer = document.querySelector('#stencil')

    stencilContainer?.appendChild(this.stencil.container)
  }

  private static initShape() {
    const { graph } = this

    const r1 = graph.createNode({
      shape: 'flow-chart-rect',
      attrs: {
        body: {
          rx: 24,
          ry: 24,
        },
        text: {
          text: 'Start',
        },
      },
      data: {
        semantic: '',
        location: '',
      },
    })

    const r2 = graph.createNode({
      shape: 'flow-chart-rect',
      attrs: {
        text: {
          text: 'Process',
        },
      },
      data: {
        semantic: '',
        location: '',
      },
    })

    const r3 = graph.createNode({
      shape: 'flow-chart-rect',
      width: 52,
      height: 52,
      angle: 45,
      attrs: {
        'edit-text': {
          style: {
            transform: 'rotate(-45deg)',
          },
        },
        'text': {
          text: 'Check',
          transform: 'rotate(-45deg)',
        },
      },
      ports: {
        groups: {
          top: {
            position: {
              name: 'top',
              args: {
                dx: -26,
              },
            },
          },
          right: {
            position: {
              name: 'right',
              args: {
                dy: -26,
              },
            },
          },
          bottom: {
            position: {
              name: 'bottom',
              args: {
                dx: 26,
              },
            },
          },
          left: {
            position: {
              name: 'left',
              args: {
                dy: 26,
              },
            },
          },
        },
      },
      data: {
        semantic: '',
        location: '',
      },
    })

    const r4 = graph.createNode({
      shape: 'flow-chart-rect',
      width: 70,
      height: 70,
      attrs: {
        body: {
          rx: 35,
          ry: 35,
        },
        text: {
          text: 'Junction',
        },
      },
      data: {
        semantic: '',
        location: '',
      },
    })

    const c1 = graph.createNode({
      shape: 'flow-chart-image-rect',
      data: {
        semantic: '',
        location: '',
      },
    })

    const c2 = graph.createNode({
      shape: 'flow-chart-title-rect',
      data: {
        semantic: '',
        location: '',
      },
    })

    const c3 = graph.createNode({
      shape: 'flow-chart-animate-text',
      data: {
        semantic: '',
        location: '',
      },
    })

    const t1 = graph.createNode({
      shape: 'flow-text-block',
      text: 'This is a transparent text-block.',
    })

    const t2 = graph.createNode({
      shape: 'flow-accent-text-block',
      text: 'This is an emphatic text-block.',
    })

    const t3 = graph.createNode({
      shape: 'flow-outline-text-block',
      text: 'This is a contoured text-block.',
    })

    const g1 = graph.createNode({
      shape: 'groupNode',
      attrs: {
        text: {
          text: 'Group Name',
        },
      },
      data: {
        parent: true,
        semantic: '',
        location: '',
      },
    })

    this.stencil.load([r1, r2, r3, r4], 'basic')
    this.stencil.load([c1, c2, c3], 'combination')
    this.stencil.load([t1, t2, t3], 'text')
    this.stencil.load([g1], 'group')
  }

  private static initGraphShape(data: any) {
    this.graph.fromJSON(data as any)
  }

  private static showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1)
      ports[i].style.visibility = show ? 'visible' : 'hidden'
  }

  private static initEvent() {
    const { graph } = this
    const container = document.getElementById('container')!

    // register contextmenu tool
    Graph.registerNodeTool('contextmenu', ContextMenuTool, true)
    Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
    graph.on('node:mouseenter',
      FunctionExt.debounce(() => {
        const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGAElement>

        this.showPorts(ports, true)
      }),
      500,
    )
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGAElement>

      this.showPorts(ports, false)
    })

    graph.on('node:mouseenter', ({ node }) => {
      node.addTools(menuTool)
    })
    graph.on('node:mouseleave', ({ node }) => {
      node.removeTools()
    })
    graph.on('node:collapse', ({ node, e }: any) => {
      e.stopPropagation()
      node.toggleCollapse()

      const collapsed = node.isCollapsed()
      const cells = node.getDescendants()

      cells.forEach((n: any) => {
        if (collapsed)
          n.hide()
        else
          n.show()
      })
    })

    // configure the edge:mouseenter event to generate contextmenu
    graph.on('edge:mouseenter', ({ edge }) => {
      edge.addTools(menuTool)
    })
    graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools()
    })
    graph.on('history:change', () => {
      canUndo.value = history.canUndo()
      canRedo.value = history.canRedo()
    })

    // For flow-image-rect, do resize the image while resizing the bounding box
    graph.on('node:resizing', ({ node }) => {
      if (node.shape === 'flow-image-rect') {
        console.log(node.getSize())
        node.setAttrs({
          image: {
            width: node.getSize().width,
            height: node.getSize().height,
          },
        }, {
          silent: true,
        })
      }
    })

    // For Collaboration, give user a hint(sendMsg) when someone is making changes(following events) on the graph
    graph.on('node:added', ({ node }) => {
      // sendMsg(JSON.stringify(graph.toJSON()))
      sendMsg(JSON.stringify({
        event: 'node:added',
        data: node,
      }))
      saveGraph()
    })
    graph.on('edge:connected', ({ edge }) => {
      // sendMsg(JSON.stringify(graph.toJSON()))
      sendMsg(JSON.stringify({
        event: 'edge:connected',
        data: edge,
      }))
      saveGraph()
    })
    graph.on('cell:removed', ({ cell }) => {
      // sendMsg(JSON.stringify(graph.toJSON()))
      sendMsg(JSON.stringify({
        event: 'cell:removed',
        data: cell.id,
      }))
      saveGraph()
    })
    graph.on('cell:change:attrs', ({ cell }) => {
      // sendMsg(JSON.stringify(graph.toJSON()))
      sendMsg(JSON.stringify({
        event: 'cell:change:attrs',
        data: cell,
      }))
      saveGraph()
    })
    graph.on('cell:change:labels', ({ cell }) => {
      sendMsg(JSON.stringify({
        event: 'cell:change:labels',
        data: cell,
      }))
      saveGraph()
    })
    graph.on('node:resized', ({ node }) => {
      sendMsg(JSON.stringify({
        event: 'node:resized',
        data: node,
      }))
      saveGraph()
    })
    graph.on('node:moved', ({ node }) => {
      sendMsg(JSON.stringify({
        event: 'node:moved',
        data: node,
      }))
      saveGraph()
    })

    // when clicking the node, record the cell property in store
    graph.on('node:click', ({ e, x, y, cell, view }) => {
      Object.assign(cellPropertyStore, { e, x, y, cell, view })
    })

    // when clicking the blank, clear the cell property store
    graph.on('blank:click', () => {
      cellPropertyStore.e = cellPropertyStore.x = cellPropertyStore.y
        = cellPropertyStore.cell = cellPropertyStore.view = null as any
    })
  }
}

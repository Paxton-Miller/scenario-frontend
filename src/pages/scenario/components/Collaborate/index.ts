import { ref } from 'vue'
import type { Graph } from '@antv/x6'
import FlowGraph from '@/pages/scenario/components/Graph'
import { useDimensionStore } from '@/store/dimension'
import { useOnlineEditorStore } from '@/store/onlineEditor'

/**
 * @name: index
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/22/2024 7:26 PM
 * @version: 1.0
 */
const ws = ref(null)
const graph = ref<Graph>()
const store = useDimensionStore()
const onlineEditorStore = useOnlineEditorStore()
const lastUpdateTime = ref<number>(0)
const updateInterval = ref<number>(500)
const messageBuffer = ref<string>('')
const END_OF_MSG = '<EOF>' as string

export const initWebSocket = (roomUUID: string, type: string) => {
  // if (roomUUID === undefined || type === undefined) return
  // if (!ws.value) {
  ws.value = new WebSocket(`ws://localhost:8898/graphWs/${type}/${roomUUID}?token=${localStorage.getItem('token')?.substring(7)}`) as any
  graph.value = FlowGraph.graph as Graph
  (ws.value as any).onopen = () => {
    console.log('graph websocket connected')
  }

  (ws.value as any).onmessage = async (message: any) => {
    messageBuffer.value += message.data
    if (message.data.endsWith(END_OF_MSG)) {
      const completeMsg = messageBuffer.value.split(END_OF_MSG)[0]
      const data = JSON.parse(completeMsg)

      // if the message is real content and the dimensions match.
      if (data.isMsg && store.type === data.dimension) {
        const json = JSON.parse(data.content)

        // record the current editing user
        onlineEditorStore.userId = data.userId
        onlineEditorStore.isEditing = true

        if (json) {
          console.log(json)

          /* eslint-disable */
          // render the message as graph content
          switch (json.event) {
            case 'node:added':
              FlowGraph.graph.addNode(json.data)

              // graph.value?.addNode(json.data)
              break
            case 'edge:connected':
              FlowGraph.graph.addEdge(json.data)
              break
            case 'cell:removed':
              FlowGraph.graph.removeCell(json.data)
              break
            case 'node:resized':
              const resizingNode = FlowGraph.graph.getNodes().filter(node => node.id === json.data.id)[0]

              resizingNode?.size(json.data.size.width, json.data.size.height)

              // graph.value?.getNodes(json.data)[0].setSize(json.data.size)
              break
            case 'cell:change:attrs':
              FlowGraph.graph.getCellById(json.data.id).setAttrs(json.data.attrs)
              break
            case 'cell:change:labels':
              (FlowGraph.graph.getCellById(json.data.id) as any)?.setLabels(json.data?.labels)
              break
            case 'cell:change:data':
              FlowGraph.graph.getCellById(json.data.id)?.setData(json.data?.data, { overwrite: true })
              break
            case 'node:moved':
              const movedNode = FlowGraph.graph.getNodes().filter(node => node.id === json.data.id)[0]

              movedNode?.position(json.data.position.x, json.data.position.y)

              // graph.value?.getNodes(json.data)[0].position(json.data.position.x, json.data.position.y)
              break

            // graph.value?.resetCells([json.data])
            case 'view:change':
              const mapNode = FlowGraph.graph.getNodes().filter(node => node.id === json.data.id)[0]

              // No.2 After the following, turn to change:data in MapNode.vue
              mapNode.setData({
                view: {
                  center: json.mapView.values_.center,
                  zoom: json.mapView.values_.zoom,
                },
              })
              break
            default:
              break
          }
          /* eslint-disable */
        } else {
          graph.value = FlowGraph.init({
            cells: [],
          })
        }
        console.log(json)
      }
      console.log(data)
      messageBuffer.value = ''
    }
  }
  (ws.value as any).onerror = (e: any) => {
    console.log(e)
  }
  (ws.value as any).onclose = (e: any) => {
    console.log(`${e.code} ${e.reason} ${e.wasClean}`)
  }
}

// heart beats 60s per time in case losing the websocket connection.
export const sendMessagePing = () => {
  if (ws.value && (ws.value as any).readyState === WebSocket.OPEN)
    (ws.value as any).send('ping')
  else
    console.log('WebSocket has lost connection~')
}

export const sendMsg = (json: any) => {
  (ws.value as any).send(json)
}

export const onClose = () => {
  (ws.value as any).close()
}

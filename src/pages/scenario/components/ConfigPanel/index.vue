<script lang="ts">
import FlowGraph from '../../graph/index'
import ConfigGrid from './ConfigGrid/index.vue'
import ConfigNode from './ConfigNode/index.vue'
import ConfigEdge from './ConfigEdge/index.vue'
import './index.less'
import { defineComponent, provide, ref } from 'vue'
import { globalGridAttr } from '../../models/global'

export default defineComponent({
  name: 'Index',
  components: {
    ConfigGrid,
    ConfigNode,
    ConfigEdge,
  },
  setup() {
    const type = ref('grid')
    const id = ref('')

    // 待优化
    const boundEvent = function (): void {
      const { graph } = FlowGraph

      graph.on('blank:click', () => {
        type.value = 'grid'
      })
      graph.on('cell:click', ({ cell }) => {
        type.value = cell.isNode() ? 'node' : 'edge'
        id.value = cell.id
      })
    }

    boundEvent()
    provide('globalGridAttr', globalGridAttr)
    provide('id', id)

    return {
      type,
      id,
    }
  },
})
</script>

<template>
  <div class="config">
    <ConfigGrid v-show="type === 'grid'" />
    <ConfigNode v-show="type === 'node'" />
    <ConfigEdge v-show="type === 'edge'" />
  </div>
</template>

<style lang="less" scoped></style>

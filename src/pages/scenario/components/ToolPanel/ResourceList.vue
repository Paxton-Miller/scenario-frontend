<!--
  @name: ResourceList
  @description: TODO
  @author: Lingkai Shi
  @date: 7/18/2024 9:30 AM
  @version: 1.0
-->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Dnd } from '@antv/x6-plugin-dnd'
import { getAllOpenResource, getAllResourceByUserId } from '@/api/ResourceApi'
import type { GetAllResourceResponse, Resource } from '@/api/class/Resource'
import FlowGraph from '@/pages/scenario/components/Graph'

const props = defineProps({
  queryContent: {
    default: '',
    type: String,
  },
  width: {
    default: '100px',
    type: String,
  },
  height: {
    default: '100px',
    type: String,
  },
  showName: {
    default: true,
    type: Boolean,
  },
  layout: {
    default: 'total, prev, pager, next, jumper',
    type: String,
  },
  pageSize: {
    default: 8,
    type: Number,
  },
  isRestricted: {
    default: true,
    type: Boolean,
  },
})

const loading = ref<boolean>(false)
const tableData = ref<Resource[]>([])
const page = ref<number>(1)
const totalCount = ref<number>(8)

const handleSearch = () => {
  tableData.value = tableData.value.filter(item => item.name.toLowerCase().includes(props.queryContent!.toLowerCase()))
  page.value = 1
  totalCount.value = tableData.value.length
}

const getTableData = async () => {
  loading.value = true
  let result
  if (props.isRestricted)
    result = await getAllResourceByUserId(page.value, props.pageSize) as unknown as GetAllResourceResponse
  else
    result = await getAllOpenResource(page.value, props.pageSize) as unknown as GetAllResourceResponse

  if (result) {
    tableData.value = result.list
    page.value = result.page
    totalCount.value = result.totalCount
  }
  loading.value = false
}

const dragToGraph = (item: any, e) => {
  if (props.showName)
    return
  const { graph } = FlowGraph

  const node = graph.createNode({
    width: 100,
    height: 100,
    shape: 'flow-image-rect',
    attrs: {
      image: {
        'xlink:href': item.url,
        'width': 100,
        'height': 100,
      },
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-shadow
  graph.on('node:resizing', ({ node }) => {
    if (node.shape === 'flow-image-rect') {
      // For flow-image-rect, do resize the image while resizing the bounding box
      console.log(node.getSize())
      node.setAttrs({
        image: {
          width: node.getSize().width,
          height: node.getSize().height,
        },
      })
    }
  })

  const dnd = new Dnd({
    target: graph,

    /* validateNode: () => {
      console.log('成功拖拽至目标画布')
    }, */
  })

  dnd.start(node, e)
}

// expose the method
defineExpose({
  handleSearch,
  getTableData,
})

const handlePageChange = async () => {
  await getTableData()
}

onMounted(async () => {
  await getTableData()
})
</script>

<template>
  <div>
    <ElRow
      v-loading="loading"
      :gutter="20"
      style="margin-right: 15px;margin-left: -5px"
      type="flex"
    >
      <span v-if="tableData.length === 0">&nbsp;No Data</span>
      <ElCol
        v-for="(item, index) in tableData"
        :key="index"
        :span="6"
      >
        <div @mousedown="dragToGraph(item, $event)">
          <ElTooltip
            :disabled="showName"
            :content="item.name"
          >
            <ElImage
              :style="`width:${width};height:${height}`"
              :src="item.url"
              fit="fill"
            />
          </ElTooltip>
          <span v-if="showName">{{ item.name }}</span>
        </div>
      </ElCol>
    </ElRow>

    <ElPagination
      v-model:current-page="page"
      small
      :page-size="pageSize"
      class="align-right"
      :layout="layout"
      :total="totalCount"
      @size-change="handlePageChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped lang="scss">
.el-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.el-row .el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all .5s;
}

.pagination-container {
  margin-top: -3px;
  margin-bottom: 30px;
}

.align-right {
  display: flex;
  justify-content: flex-end;
}
</style>

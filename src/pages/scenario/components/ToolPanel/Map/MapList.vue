<!--
  @name: MapList
  @description: TODO
  @author: Lingkai Shi
  @date: 8/1/2024 9:57 PM
  @version: 1.0
-->

<script setup lang="ts">
import { Dnd } from '@antv/x6-plugin-dnd'
import { onMounted, ref } from 'vue'
import FlowGraph from '@/pages/scenario/components/Graph'
import { delMap, getAllMapByUserId, getAllOpenMap } from '@/api/MapApi'
import type { GetAllMapResponse, Map } from '@/api/class/Map'

const props = defineProps({
  queryContent: {
    default: '',
    type: String,
  },
  width: {
    default: '25px',
    type: String,
  },
  height: {
    default: '25px',
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
const tableData = ref<Map[]>([])
const page = ref<number>(1)
const totalCount = ref<number>(8)

const currentHoverIndex = ref(null)
const dropdownVisible = ref(false)

const handleMouseLeave = () => {
  if (!dropdownVisible.value)
    currentHoverIndex.value = null
}

const handleVisibleChange = visible => {
  dropdownVisible.value = visible
}

const getTableData = async () => {
  loading.value = true
  let result
  if (props.isRestricted)
    result = await getAllMapByUserId(page.value, props.pageSize) as unknown as GetAllMapResponse
  else
    result = await getAllOpenMap(page.value, props.pageSize) as unknown as GetAllMapResponse

  if (result) {
    tableData.value = result.list
    page.value = result.page
    totalCount.value = result.totalCount
  }
  loading.value = false
}

defineExpose({
  getTableData,
})

const dragToGraph = (item: any, e) => {
  if (props.showName)
    return
  const { graph } = FlowGraph

  const node = graph.createNode({
    shape: 'custom-vue-node',
    data: {
      map: item,
    },
  })

  const dnd = new Dnd({
    target: graph,

    validateNode: () => {
      console.log(node)
    },
  })

  dnd.start(node, e)
}

const handlePageChange = async () => {
  await getTableData()
}

const handleRename = () => {

}

const handleDelete = async (index: number) => {
  const result = await delMap(tableData.value![index].id)
  if (result)
    getTableData()
}

onMounted(async () => {
  await getTableData()
})
</script>

<template>
  <div>
    <ElRow
      :gutter="20"
      style="margin-right: 15px; margin-left: -5px"
      type="flex"
    >
      <span v-if="tableData.length === 0">&nbsp;No Data</span>
      <ElCol
        v-for="(item, index) in tableData"
        :key="index"
        :span="6"
      >
        <div @mousedown="dragToGraph(item, $event)">
          <div
            class="align-center image-container"
            style="margin-bottom: 3px"
            @mouseover="currentHoverIndex = index"
            @mouseleave="handleMouseLeave"
          >
            <ElTooltip
              :disabled="showName"
              :content="item.name"
            >
              <ElImage
                :style="`width:${width};height:${height}`"
                :src="item.logoUrl"
                fit="fill"
                class="image"
              />
            </ElTooltip>
            <div
              v-if="currentHoverIndex === index && showName"
              class="overlay"
            >
              <ElDropdown
                :visible="dropdownVisible"
                size="small"
                @visible-change="handleVisibleChange"
              >
                <span
                  class="el-dropdown-link"
                  style="color: white; font-weight: bolder; font-size: larger"
                  @click.prevent
                >
                  ...
                </span>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem @click="handleRename">
                      Rename
                    </ElDropdownItem>
                    <ElDropdownItem @click="handleDelete(index)">
                      Delete
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </div>
          </div>
          <br>
          <div
            class="align-center"
            :style="`width:${width}`"
          >
            <span v-if="showName">{{ item.name }}</span>
          </div>
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

.align-center {
  display: flex;
  justify-content: center;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image {
  width: 100%;
  height: auto;
  transition: filter 0.3s;
}

.image-container:hover .image {
  filter: brightness(70%);
}

.overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.el-dropdown-menu {
  width: 150px;
}

.el-dropdown-item {
  cursor: pointer;
}

.el-dropdown-item:hover {
  background-color: #f5f5f5;
}

::v-deep .el-dropdown-menu__item {
  white-space: nowrap;
}
</style>

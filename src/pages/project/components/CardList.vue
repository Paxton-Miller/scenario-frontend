<!--
  @name: CardList
  @description: TODO
  @author: Lingkai Shi
  @date: 7/9/2024 9:13 PM
  @version: 1.0
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAllMyOwnProject } from '@/api/ProjectApi'
import type { GetAllProjectResponse, Project } from '@/api/class/Project'
import NoData from '@/pages/common/NoData.vue'

const props = defineProps({
  queryContent: {
    default: '',
    type: String,
  },
})

const loading = ref<boolean>(false)
const tableData = ref<Project[]>([])
const page = ref<number>(1)
const pageSize = ref<number>(8)
const totalCount = ref<number>(8)

const handleSearch = () => {
  tableData.value = tableData.value.filter(item => item.name.toLowerCase().includes(props.queryContent!.toLowerCase()))
  page.value = 1
  totalCount.value = tableData.value.length
}

const getTableData = async () => {
  const result = await getAllMyOwnProject(page.value, pageSize.value) as unknown as GetAllProjectResponse
  if (result) {
    tableData.value = result.list
    page.value = result.page
    pageSize.value = result.pageSize
    totalCount.value = result.totalCount
  }
}

// 向外暴露方法
defineExpose({
  handleSearch,
  getTableData,
})

const handleSizeChange = async () => {
  await getTableData()
}

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
      <ElCol
        v-for="(item, index) in tableData"
        :key="index"
        :span="6"
      >
        <ElCard
          class="box-card"
          shadow="always"
          :body-style="{ padding: '0px' }"
          style="margin-top: 15px; margin-bottom: 15px"
        >
          <template #header>
            <div class="header">
              <span class="label">Project</span>
              <span class="header-label">{{ item.name }}</span>
              <div class="card-header-tag-green" />
              <div class="card-header-tag-blue" />
            </div>
          </template>
          <div style="margin: 15px">
            <div>
              <div class="card-label">
                Name
              </div>
              <span>{{ item.name }}</span>
            </div>
            <div>
              <div class="card-label">
                Date
              </div>
              <span>{{ item.createDate.substring(0, 10) }}</span>
            </div>
            <div>
              <div class="card-label">
                Progress
              </div>
              <span>{{ item.progress * 100 }}%</span>
            </div>
          </div>
          <div class="footer">
            <div style="display: flex;align-items: center">
              <RouterLink
                :to="{ name: 'Project', query: { id: 1 } }"
                target="_blank"
              >
                <ElButton
                  type="text"
                  style="color: #18c8bd"
                >
                  Export
                </ElButton>
              </RouterLink>
            </div>
            <div style="display:flex; align-items: center;color: #cccccc">
              |
            </div>
            <div style="display: flex;align-items: center">
              <RouterLink
                :to="{ name: 'ProjectDetail', query: { id: item.id } }"
                target="_blank"
              >
                <ElButton
                  type="text"
                  style="color: #18c8bd"
                >
                  View
                </ElButton>
              </RouterLink>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <NoData v-if="totalCount === 0" />

    <ElPagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      class="align-right"
      :page-sizes="[8, 12, 16, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      @size-change="handleSizeChange"
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

.el-form-item {
  margin-bottom: 0 !important;
}

.pagination-container {
  margin-top: -3px;
  margin-bottom: 30px;
}

.box-card {
  .header {
    position: relative;

    .label {
      padding: 0 3px;
      background-color: #fdf0da;
      color: #f19901;
    }

    .header-label {
      padding-left: 10px;
    }

    .card-header-tag-blue {
      position: absolute;
      width: 68px;
      height: 30px;
      top: -14px;
      right: -15px;
      background-image: url("~@images/img_dpj_t.png");
      display: inline-block;
    }

    .card-header-tag-green {
      position: absolute;
      width: 68px;
      height: 30px;
      top: -14px;
      right: -15px;
      background-image: url("~@images/img_ypj_t.png");
      display: inline-block;
    }
  }

  .footer {
    font-size: 18px !important;
    background-color: rgb(245, 247, 251);
    display: flex;
    height: 50px;
    justify-content: space-evenly;
  }

  .card-label {
    color: rgb(197, 197, 197);
    margin-right: 8px;
    width: 70px;
    display: inline-block;
    margin-bottom: 5px;
  }
}

.align-right {
  display: flex;
  justify-content: flex-end;
}
</style>

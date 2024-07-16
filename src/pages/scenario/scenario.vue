<!--
  @name: scenario
  @description: TODO
  @author: Lingkai Shi
  @date: 7/11/2024 4:41 PM
  @version: 1.0
-->

<script setup lang="ts">
import ToolBar from './components/ToolBar/index.vue'
import type { Scenario } from '@/api/class/Scenario'
import { getScenarioById } from '@/api/ScenarioApi'
import Index from '@/pages/scenario/index.vue'

const route = useRoute()
const scenario = ref<Scenario>()

const getScenarioDetail = async () => {
  scenario.value = await getScenarioById(route.query.id as unknown as number) as unknown as Scenario
}

onMounted(async () => {
  await getScenarioDetail()
  console.log(scenario.value)
})
</script>

<template>
  <div style="display: flex; align-items: center; justify-content: space-between;">
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

  <Index />
</template>

import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

/**
 * @name: echarts
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/26/2024 3:57 PM
 * @version: 1.0
 */
export const useEChartsStore = defineStore('dimension', () => {
  // state
  const myChart = ref()

  const option = ref()

  const updateChart = ref()

  return {
    myChart,
    option,
    updateChart,
  }
})

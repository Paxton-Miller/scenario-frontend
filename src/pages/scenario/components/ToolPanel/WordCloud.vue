<!--
  @name: WordCloud
  @description: WordCloud Component
  @author: Lingkai Shi
  @date: 7/24/2024 3:34 PM
  @version: 1.0
-->

<script setup lang="ts">
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { useEChartsStore } from '@/store/echarts'

const store = useEChartsStore()

const initEchart = () => {
  // Set the initial EChart
  const echartDom = document.getElementById('wordcloud')
  const myChart = echarts.init(echartDom)

  const option = {
    tooltip: {},
    series: [{
      type: 'wordCloud',
      gridSize: 2,
      sizeRange: [12, 50],
      rotationRange: [-90, 90],
      shape: 'pentagon',
      width: 600,
      height: 400,
      drawOutOfBound: true,
      textStyle: {
        color() {
          return `rgb(${[
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
          ].join(',')})`
        },
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333',
        },
      },
      data: [
        {
          name: 'Modeling',
          value: 10000,
          textStyle: {
            color: 'black',
          },
          emphasis: {
            textStyle: {
              color: 'red',
            },
          },
        },
        {
          name: 'SWAT',
          value: 6181,
        },
        {
          name: 'Landuse',
          value: 4386,
        },
        {
          name: 'soil',
          value: 4055,
        },
        {
          name: 'scenario',
          value: 2467,
        },
        {
          name: 'Model',
          value: 2244,
        },
        {
          name: 'Collaboration',
          value: 1898,
        },
        {
          name: 'Geography',
          value: 1484,
        },
        {
          name: 'conceptual',
          value: 1112,
        },
        {
          name: 'shape',
          value: 965,
        },
        {
          name: 'process',
          value: 847,
        },
        {
          name: 'refactor',
          value: 582,
        },
        {
          name: 'WRF',
          value: 555,
        },
        {
          name: 'precipitation',
          value: 550,
        },
        {
          name: 'weather',
          value: 462,
        },
        {
          name: 'connect',
          value: 366,
        },
        {
          name: 'water cycle',
          value: 360,
        },
        {
          name: 'geomodeling',
          value: 282,
        },
        {
          name: 'time',
          value: 273,
        },
        {
          name: 'space',
          value: 265,
        },
      ],
    }],
  }

  option && myChart.setOption(option)

  // Set the ECharts store for updating wordcloud in other components
  store.myChart = myChart
  store.option = option
  store.updateChart = (newData: any) => {
    store.option.series[0].data = newData
    store.myChart.setOption(store.option)
  }

  // Resize the chart when resizing the screen
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

onMounted(() => {
  initEchart()
})
</script>

<template>
  <div
    id="wordcloud"
    style="width: 256px; height: 256px"
  />
</template>

<style scoped lang="scss">

</style>

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Cell, CellView } from '@antv/x6'

/**
 * @name: cellProperty
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/24/2024 10:46 PM
 * @version: 1.0
 */
export const useCellPropertyStore = defineStore('cellProperty', () => {
  // state
  const e = ref()
  const x = ref<number>()
  const y = ref<number>()
  const cell = ref<Cell>()
  const view = ref<CellView>()

  return {
    e,
    x,
    y,
    cell,
    view,
  }
})

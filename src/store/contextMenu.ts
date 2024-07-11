/**
 * @name: contextMenu
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/11/2024 3:49 PM
 * @version: 1.0
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Cell, CellView } from '@antv/x6'

// 第一个参数是应用中 Store 的唯一 ID
export const useContextMenuStore = defineStore('contextMenu', () => {
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

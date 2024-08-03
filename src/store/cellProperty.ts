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
// record the cell property when clicking the cell, use it when having to display the cell property in property tab
export const useCellPropertyStore = defineStore('cellProperty', () => {
  // state
  const e = ref()
  const x = ref<number>()
  const y = ref<number>()
  const cell = ref<Cell>()
  const view = ref<CellView>()

  const getName = () => {
    let result
    if (view.value?.cell.shape === 'edge')
      result = (view.value?.cell as any).getLabels()[0]?.attrs.label.text
    else if (view.value?.cell.shape.includes('text-block'))
      result = (view.value?.cell as any).getAttrs().label.text
    else
      result = (view.value?.cell as any).getLabel()

    return result
  }

  const setName = (name: string) => {
    if (view.value?.cell.shape === 'edge')
      (view.value?.cell as any).setLabels([{ attrs: { label: { text: name } } }])
    else if (view.value?.cell.shape.includes('text-block'))
      (view.value?.cell as any).setAttrs({ label: { text: name } })
    else
      (view.value?.cell as any).setLabel(name)
  }

  return {
    e,
    x,
    y,
    cell,
    view,
    getName,
    setName,
  }
})

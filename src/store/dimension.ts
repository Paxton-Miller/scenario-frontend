import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * @name: dimension
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/23/2024 6:50 PM
 * @version: 1.0
 */
// record the dimension of the scenario
export const useDimensionStore = defineStore('dimension', () => {
  // state
  const type = ref<string>()
  const scenarioId = ref<number>(1)
  const roomUUID = ref<string>()

  return {
    type,
    scenarioId,
    roomUUID,
  }
})

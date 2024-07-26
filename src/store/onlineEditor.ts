import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * @name: onlineEditor
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/25/2024 3:27 PM
 * @version: 1.0
 */
// Record the current online editor
export const useOnlineEditorStore = defineStore('onlineEditor', () => {
  // state
  const isEditing = ref<boolean>(false)
  const userId = ref<number>()
  const userIds = ref<number[]>([])

  return {
    isEditing,
    userId,
    userIds,
  }
})

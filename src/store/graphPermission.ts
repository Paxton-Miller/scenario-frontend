import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * @name: graphPermission
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/30/2024 10:50 AM
 * @version: 1.0
 */
export const useGraphPermission = defineStore('graphPermission', () => {
  // state
  const isWrite = ref<boolean>()
  const permissionLevel = ref<string>()

  return {
    isWrite,
    permissionLevel,
  }
})

/**
 * @name: store.ts
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 5/15/2024 9:59 AM
 * @version: 1.0
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'

// 第一个参数是应用中 Store 的唯一 ID
export const useHeaderStore = defineStore('custom', () => {
  // state
  const count = ref(0)
  const count2 = ref(0)
  const list = ref([])
  const siderType = ref(true)

  const changeSiderType = () => {
    siderType.value = !siderType.value
  }

  // getter
  const doubleCount = computed(() => {
    return count.value * 2
  })

  // 同步action
  const add = () => {
    count.value++
  }

  const update = val => {
    count.value = val.value
  }

  const add2 = () => {
    count2.value++
  }

  // 异步action
  const getList = async () => {
    const res = await axios.get('https://api.oioweb.cn/api/common/history')
    if (res.data.code === 200)
      list.value = res.data.result || []
  }

  return {
    count,
    count2,
    doubleCount,
    list,
    siderType,
    changeSiderType,
    add,
    update,
    add2,
    getList,
  }
})

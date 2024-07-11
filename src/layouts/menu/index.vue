<script setup>
import { ref } from 'vue'
import { useHeaderStore } from '@/store/header'

const store = useHeaderStore()

const iconList = ref(['share', 'lock', 'user', 'tickets', 'pie-chart'])
const icon = ref('menu')

const defaultActive = ref(localStorage.getItem('path') || '/admin/data-pubish')

const menuList = ref([
  {
    id: 1,
    authName: '数据共享',
    path: 'admin/share',
    children: [
      {
        id: 4,
        authName: '数据模板',
        path: 'admin/data-template',
        children: [],
        order: null,
      },
      {
        id: 5,
        authName: '数据发布',
        path: 'admin/home',
        children: [],
        order: null,
      },
    ],
    order: 1,
  },
  {
    id: 2,
    authName: '数据安全',
    path: 'admin/security',
    children: [
      {
        id: 6,
        authName: '访问权限',
        path: 'admin/data-permission',
        children: [],
        order: null,
      },
      {
        id: 7,
        authName: '数据追踪',
        path: 'admin/data-track',
        children: [],
        order: null,
      },
      {
        id: 8,
        authName: '统计报表',
        path: 'admin/data-statistics',
        children: [],
        order: null,
      },
    ],
    order: 2,
  },
  {
    id: 3,
    authName: '用户管理',
    path: 'admin/user',
    children: [
      {
        id: 9,
        authName: '用户列表',
        path: 'admin/user-list',
        children: [],
        order: null,
      },
      {
        id: 10,
        authName: '用户权限',
        path: 'admin/user-permission',
        children: [],
        order: null,
      },
      {
        id: 11,
        authName: '行为分析',
        path: 'admin/user-analysis',
        children: [],
        order: null,
      },
    ],
    order: 3,
  },
],
)

const savePath = path => {
  localStorage.setItem('path', `/${path}`)
}
</script>

<template>
  <ElMenu
    active-text-color="#ffd04b"
    background-color="#304156"
    class="el-menu-vertical-demo"
    :default-active="defaultActive"
    text-color="#fff"
    router
    unique-opened
    :collapse="!store.siderType"
  >
    <ElSubMenu
      v-for="(itemApi, index) in menuList"
      :key="itemApi.id"
      :index="itemApi.id"
    >
      <template #title>
        <ElIcon>
          <component :is="iconList[index]" />
        </ElIcon>
        <span>{{ itemApi.authName }}</span>
      </template>
      <ElMenuItem
        v-for="it in itemApi.children"
        :key="it.id"
        :index="`/${it.path}`"
        @click="savePath(it.path)"
      >
        <template #title>
          <ElIcon>
            <component :is="icon" />
          </ElIcon>
          <span>{{ it.authName }}</span>
        </template>
      </ElMenuItem>
    </ElSubMenu>
  </ElMenu>
</template>

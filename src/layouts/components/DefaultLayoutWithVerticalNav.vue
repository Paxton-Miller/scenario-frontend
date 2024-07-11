<script lang="ts" setup>
import logo from '@images/logo.svg?raw'

// Components
import Footer from '@/layouts/components/Footer.vue'

const items = [
  {
    title: 'Home',
    disabled: false,

    // to 切换子路由；href刷新整个页面
    to: '/admin/dashboard',
  },
  {
    title: '数据共享',
    disabled: true,
    href: 'breadcrumbs_dashboard',
  },
  {
    title: '数据发布',
    disabled: false,
    to: '/admin/home',
  },
]
</script>

<template>
</template>

<style lang="scss" scoped>
</style>

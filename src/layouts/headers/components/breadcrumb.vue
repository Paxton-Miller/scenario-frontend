<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbList = ref([])

const initBreadcrumbList = () => {
  breadcrumbList.value = route.matched
  console.log(route.matched)
}

const handleRedirect = path => {
  router.push(path)
}

watch(
  route,
  () => {
    initBreadcrumbList()
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <ElBreadcrumb separator="/">
    <ElBreadcrumbItem
      v-for="(itemApi, index) in breadcrumbList"
      :key="index"
    >
      <span
        v-if="index === breadcrumbList.length - 1"
        class="no-redirect"
      >{{
        itemApi.name
      }}</span>
      <span
        v-else
        class="redirect"
        @click="handleRedirect(itemApi.path)"
      >{{
        itemApi.name
      }}</span>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<style lang="scss" scoped>
.no-redirect {
  color: #97a8be;
  cursor: text;
}

.redirect {
  color: #666;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: $menuBg;
  }
}
</style>

<!--
  @name: projectDetail
  @description: TODO
  @author: Lingkai Shi
  @date: 7/10/2024 6:56 PM
  @version: 1.0
-->

<script setup lang="ts">
import { ref } from 'vue'
import Detail from '@/pages/project/components/ProjectDetail.vue'
import { getProjectById } from '@/api/ProjectApi'
import type { Project } from '@/api/class/Project'
import AccessDenied from '@/pages/common/[...accessDenied].vue'

const project = ref<Project>()
const route = useRoute()
const isCreator = ref<boolean>(true)

const getProjectDetail = async () => {
  // get project by id
  const result = await getProjectById(route.query.id as unknown as number) as unknown as Project
  if (result)
    project.value = result
}

const checkIdentity = async () => {
  // Check if the user is the creator of the project?
  if (localStorage.getItem('id') == project.value?.createUserId)
    isCreator.value = true
  else isCreator.value = false
}

onMounted(async () => {
  await getProjectDetail()
  await checkIdentity()
})
</script>

<template>
  <Detail
    v-if="isCreator"
    :project="project"
  />
  <AccessDenied v-if="!isCreator" />
</template>

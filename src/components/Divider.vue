<!--
  @name: Divider
  @description: TODO 分割线
  @author: Lingkai Shi
  @date: 4/26/2024 8:23 PM
  @version: 1.0
-->

<script setup lant="ts">
const prop = defineProps({
  text: String,
})
</script>

<template>
  <div>{{ prop.text }}</div>
</template>

<script setup lang="ts">
import misc404 from '@images/pages/404.png'
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="404"
      title="Page Not Found ⚠️"
      description="Oops, we couldn't find the page you are looking for."
    />

    <!-- 👉 Image -->
    <div class="text-center">
      <img
        :src="misc404"
        alt="Coming Soon"
        :max-width="800"
        class="mx-auto"
      >
      <RouterLink to="/admin/project">
        <ElButton>
          Back to Home
        </ElButton>
      </RouterLink>
    </div>
  </div>
</template>

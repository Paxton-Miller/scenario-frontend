<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { logout } from '@/api/UserApi'
import TokenTool from '@/utils/class/TokenTool'

const store = useStore()

const router = useRouter()

const squareUrl = ref(
  'https://img0.baidu.com/it/u=1056811702,4111096278&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
)

const handleLogout = async () => {
  // store.dispatch('app/logout')
  const result = await logout()
  if (result) {
    new TokenTool().ClearLocalStorage()
    router.push({ path: '/login' })
  }
}
</script>

<template>
  <ElDropdown>
    <span class="el-dropdown-link">
      <ElAvatar
        shape="square"
        :size="40"
        :src="squareUrl"
      />
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem @click="handleLogout">
          Sign out
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style lang="scss" scoped>
::v-deep .el-dropdown-menu__item {
  white-space: nowrap;
}
</style>

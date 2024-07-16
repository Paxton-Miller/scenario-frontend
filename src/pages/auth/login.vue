<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { login } from '@/api/UserApi'
import type { LoginForm } from '@/pages/auth/class/Login'
import TokenTool from '@/utils/class/TokenTool'
import type { LoginResponse, SessionWebUser } from '@/api/class/User'

const form = ref<LoginForm>({
  email: '',
  password: '',
})

const formRef = ref<FormInstance>()

const rules = reactive<FormRules<LoginForm>>({
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter the correct email format', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, max: 20, message: 'The password should be 6-20 characters long', trigger: 'blur' },
  ],
})

const router = useRouter()

const submit = async (formValidator: FormInstance | undefined) => {
  if (!formValidator)
    return
  await formValidator.validate(async valid => {
    if (valid) {
      const { token } = await login(form.value) as unknown as LoginResponse
      if (token) {
        localStorage.token = `Bearer ${token}`

        const toolObj = new TokenTool()
        const sessionWebUser: SessionWebUser = JSON.parse(toolObj.FormatToken(localStorage.token))

        localStorage.expDate = toolObj.FormatDate(sessionWebUser.exp)
        localStorage.id = sessionWebUser.id
        localStorage.email = sessionWebUser.email
        localStorage.type = sessionWebUser.type ? 'userApi' : 'admin'
        ElMessage.success('You\'re signed in')
        router.push('/admin/project')
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <ElForm
      ref="formRef"
      :model="form"
      class="login-form"
      :rules="rules"
    >
      <div class="title-container">
        <h3 class="title">
          Geographic Conceptual Scenario-based Cognitive Collaboration Construction System
        </h3>
      </div>
      <ElFormItem prop="email">
        <ElInput
          v-model="form.email"
          placeholder="Please enter email"
          :prefix-icon="User"
        />
      </ElFormItem>
      <ElFormItem prop="password">
        <ElInput
          v-model="form.password"
          type="password"
          placeholder="Please enter password"
          :prefix-icon="Lock"
        />
      </ElFormItem>
      <ElRow :gutter="50">
        <ElCol :span="12">
          <ElButton
            type="primary"
            class="login-button"
            @click="submit(formRef)"
          >
            Sign in
          </ElButton>
        </ElCol>
        <ElCol :span="12">
          <RouterLink to="/register">
            <ElButton
              type="primary"
              class="login-button"
            >
              Sign up
            </ElButton>
          </RouterLink>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .login-button {
      width: 100%;
      box-sizing: border-box;
    }
  }

  .tips {
    font-size: 16px;
    line-height: 28px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    ::v-deep .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    userApi-select: none;
  }
}
</style>

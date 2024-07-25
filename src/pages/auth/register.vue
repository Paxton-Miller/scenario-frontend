<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, Message, User } from '@element-plus/icons-vue'
import { register } from '@/api/UserApi'
import type { RegisterForm } from '@/pages/auth/class/Register'

const form = ref<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmPwd: '',
})

const formRef = ref<FormInstance>()

const rules = reactive<FormRules<RegisterForm>>({
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter the correct email format', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, max: 20, message: 'The password should be 6-20 characters long', trigger: 'blur' },
  ],
  confirmPwd: [
    { required: true, message: 'Reconfirm password', trigger: 'blur' },
    { min: 6, max: 20, message: 'The password should be 6-20 characters long', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password)
          callback(new Error('The password and password to confirm do not match'))
        callback()
      },
      trigger: 'blur',
    },
  ],
})

const router = useRouter()

const submit = async (formValidator: FormInstance | undefined) => {
  if (!formValidator)
    return
  await formValidator.validate(async valid => {
    if (valid) {
      const userApi = await register(form.value) as unknown
      if (userApi) {
        ElMessage.success('Sign up successfully')
        window.setInterval(() => {
          router.push('/login')
        }, 500)
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
          Scenario-Based Collaborative Geographic Conceptual Modeling System
        </h3>
      </div>
      <ElFormItem prop="name">
        <ElInput
          v-model="form.name"
          placeholder="Please enter userName"
          :prefix-icon="User"
        />
      </ElFormItem>
      <ElFormItem prop="email">
        <ElInput
          v-model="form.email"
          placeholder="Please enter email"
          :prefix-icon="Message"
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
      <ElFormItem prop="confirmPwd">
        <ElInput
          v-model="form.confirmPwd"
          type="password"
          placeholder="Reconfirm password"
          :prefix-icon="Lock"
        />
      </ElFormItem>
      <ElRow :gutter="50">
        <ElCol :span="12">
          <RouterLink to="/login">
            <ElButton
              type="primary"
              class="login-button"
            >
              Sign in
            </ElButton>
          </RouterLink>
        </ElCol>
        <ElCol :span="12">
          <ElButton
            type="primary"
            class="login-button"
            @click="submit(formRef)"
          >
            Sign up
          </ElButton>
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

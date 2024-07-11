<!--
  @name: AddProjectDialog
  @description: TODO
  @author: Lingkai Shi
  @date: 7/10/2024 5:05 PM
  @version: 1.0
-->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { AddForm } from '@/pages/project/class/Project'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['closeAdd'])

const form = ref<AddForm>({
  name: '',
  description: '',
})

const formRef = ref<FormInstance>()

const rules = reactive<FormRules<AddForm>>({
  name: [
    { required: true, message: 'Please name the project', trigger: 'blur' },
  ],
})

const submit = async (formValidator: FormInstance | undefined) => {
  if (!formValidator)
    return
  await formValidator.validate(async (valid, fields) => {
    if (valid)
      emits('closeAdd', form.value)
  })
}

const handleClose = (info: AddForm) => {
  if (info.description === undefined)
    emits('closeAdd')
  else emits('closeAdd', info)
}

onMounted(async () => {
})
</script>

<template>
  <ElDialog
    :model-value="dialog"
    width="45%"
    :before-close="handleClose"
  >
    <template #header>
      <span>New Project</span>
    </template>
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="auto"
    >
      <ElFormItem
        label="name"
        prop="name"
      >
        <ElInput
          v-model="form.name"
          placeholder="Please name the project"
        />
      </ElFormItem>
      <ElFormItem
        label="description"
        prop="description"
      >
        <ElInput
          v-model="form.description"
          placeholder="Please describe the project"
        />
      </ElFormItem>
      <ElButton
        type="primary"
        @click="submit(formRef)"
      >
        OK
      </ElButton>
      <ElButton
        type="primary"
        plain
        @click="handleClose"
      >
        Cancel
      </ElButton>
    </ElForm>
  </ElDialog>
</template>

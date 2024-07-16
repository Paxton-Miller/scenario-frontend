<!--
  @name: AddConnectorDialog
  @description: TODO
  @author: Lingkai Shi
  @date: 7/11/2024 5:33 PM
  @version: 1.0
-->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Graph } from '@antv/x6'
import type { Edge, Node } from '@antv/x6'
import type { AddConnectorForm } from '@/pages/project/class/Project'
import type { ElementOption } from '@/pages/common/class/ElOption'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: true,
  },
  graph: {
    type: Graph,
    default: null,
  },
})

const emits = defineEmits(['closeAdd'])

const form = ref<AddConnectorForm>({
  source_id: '',
  target_id: '',
  label: '',
})

const sourceOptions = ref<ElementOption[]>([])
const targetOptions = ref<ElementOption[]>([])

const formRef = ref<FormInstance>()

const rules = reactive<FormRules<AddConnectorForm>>({
  source_id: [
    { required: true, message: 'Please select the source scenario', trigger: 'blur' },
  ],
  target_id: [
    { required: true, message: 'Please select the target scenario', trigger: 'blur' },
  ],
})

const getSourceOptions = () => {
  sourceOptions.value = []

  const nodes = props.graph?.getNodes() as Node[]
  for (let i = 0; i < nodes?.length; i++) {
    sourceOptions.value.push({
      label: (nodes[i] as any).label,
      value: nodes[i].id,
    })
  }
  if (form.value.source_id === '')
    form.value.source_id = sourceOptions.value[0].value
}

const getTargetOptions = (sourceId: number | string) => {
  targetOptions.value = []

  const nodes = props.graph?.getNodes() as Node[]
  for (let i = 0; i < nodes?.length; i++) {
    targetOptions.value.push({
      label: (nodes[i] as any).label,
      value: nodes[i].id,
    })
  }
  const edges = props.graph?.getEdges() as Edge[]
  for (let i = 0; i < edges?.length; i++) {
    // 不能构建已有的连接器
    if (sourceId == (edges[i].source as any).cell)
      targetOptions.value = targetOptions.value.filter(option => option.value != (edges[i].target as any).cell)
  }

  // 不能构建指向自己的连接器
  targetOptions.value = targetOptions.value.filter(option => option.value != form.value.source_id)
}

const submit = async (formValidator: FormInstance | undefined) => {
  if (!formValidator)
    return

  // async (valid, fields)
  await formValidator.validate(async valid => {
    if (valid)
      emits('closeAdd', form.value)
  })
}

onMounted(() => {
  getSourceOptions()
})

watch(() => form.value.source_id, val => {
  getTargetOptions(val)
})
</script>

<template>
  <ElDialog
    :model-value="dialog"
    width="45%"
    :before-close="() => emits('closeAdd')"
  >
    <template #header>
      <span>New Connector</span>
    </template>
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="auto"
    >
      <ElFormItem
        label="Source Scenario"
        prop="source_id"
      >
        <ElSelect v-model="form.source_id">
          <ElOption
            v-for="item in sourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="Target Scenario"
        prop="target_id"
      >
        <ElSelect v-model="form.target_id">
          <ElOption
            v-for="item in targetOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="Connector Label"
        prop="label"
      >
        <ElInput
          v-model="form.label"
          placeholder="Please label the connector"
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
        @click="() => emits('closeAdd')"
      >
        Cancel
      </ElButton>
    </ElForm>
  </ElDialog>
</template>

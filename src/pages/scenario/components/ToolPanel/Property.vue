<!--
  @name: Property
  @description: Property Tab Component
  @author: Lingkai Shi
  @date: 7/24/2024 7:57 PM
  @version: 1.0
-->

<script setup lang="ts">
import { useCellPropertyStore } from '@/store/cellProperty'
import { sendMsg } from '@/pages/scenario/components/Collaborate'
import { saveGraph } from '@/pages/scenario/components/Graph'

const store = useCellPropertyStore()
const { getName, setName } = useCellPropertyStore()

// Use ElEmpty component when the panel is blank
const isBlank = ref<boolean>(true)
const hasDescForm = ref<boolean>(true)

// The interface for semantic description and other future stuff
interface Description {
  semantic: string
  location: string
}

// The interface for custom description of attribute
interface CustomItem {
  label: string
  value: string
  isEditing: boolean
}

const name = ref<string>('')

const descEg: Description = {
  semantic: '',
  location: '',
}

const descForm = ref<Description>({})

const customItemList = ref<CustomItem[]>([])

// disable editing the label of the custom attribute
const disableEditing = (item: any) => {
  if (item.label.trim() === '')
    item.label = 'New Label'
  item.isEditing = false
}

// get the description information
const getDescForm = () => {
  const jsonData = (store.view?.cell as any).getData()
  if (jsonData) {
    // 得到与 descForm 相同的属性键值对
    const sameProperties = Object.keys(descEg)
    const filteredData = {}
    for (const [key, value] of Object.entries(jsonData)) {
      if (sameProperties.includes(key))
        filteredData[key] = value
    }
    Object.assign(descForm.value, filteredData)
  }
}

// get the custom attribute information
const getCustomItemList = () => {
  const jsonData = (store.view?.cell as any).getData()
  if (jsonData) {
    // 得到与 descForm 相同的属性键值对
    const sameProperties = Object.keys(descEg)
    const filteredData = {}
    for (const [key, value] of Object.entries(jsonData)) {
      if (!sameProperties.includes(key))
        filteredData[key] = value
    }

    // 将剩余的键值对转化为 { label: '', value: '' } 型的数组
    const resultArray = Object.keys(filteredData).map(key => ({
      label: key,
      value: filteredData[key],
      isEditing: false,
    }))

    customItemList.value = resultArray
    console.log(customItemList.value)
  }
}

// set the description and the custom attribute information
const setDescFormAndCustomItemList = () => {
  const jsonFormatted = {}

  for (const item of customItemList.value) {
    jsonFormatted[item.label] = item.value
  }
  (store.view?.cell as any).setData({ ...descForm.value, ...jsonFormatted }, { overwrite: true, silent: false })

  // Didn't know why cell:change:data event doesn't work
  sendMsg(JSON.stringify({
    event: 'cell:change:data',
    data: store.view?.cell,
  }))
  saveGraph()
}

// apply the changes made by user
const applyChanges = () => {
  setName(name.value)
  if (hasDescForm.value)
    setDescFormAndCustomItemList()
}

// add a custom attribute
const addProperty = () => {
  let newLabel = 'Label'
  let num = 1

  while (customItemList.value.some(item => item.label === newLabel)) {
    newLabel = 'Label'
    newLabel += (num++)
  }
  customItemList.value.push({
    label: newLabel,
    value: '',
    isEditing: false,
  })
}

// delete the custom attribute
const deleteProperty = (index: number) => {
  customItemList.value.splice(index, 1)
}

watch(() => store.e, val => {
  // listen to the store.e, when triggering the node:click event, refresh the property panel.
  if (val !== null) {
    name.value = getName()
    if (store.view?.cell.shape.includes('text-block'))
      hasDescForm.value = false
    else
      hasDescForm.value = true
    getDescForm()
    getCustomItemList()
    isBlank.value = false
  } else {
    isBlank.value = true
  }
})
</script>

<template>
  <ElForm
    v-if="!isBlank"
    style="max-width: 256px"
    label-width="auto"
    class="demo-ruleForm"
    size="small"
    status-icon
  >
    <ElFormItem
      label="Name"
      prop="name"
    >
      <ElInput
        v-model="name"
        :type="hasDescForm ? 'text' : 'textarea'"
      />
    </ElFormItem>
    <ElFormItem
      v-if="hasDescForm"
      label="Semantic"
      prop="semantic"
    >
      <ElInput v-model="descForm.semantic" />
    </ElFormItem>
    <ElFormItem
      v-if="hasDescForm"
      label="Location"
      prop="location"
    >
      <ElInput v-model="descForm.location" />
    </ElFormItem>
    <ElFormItem
      v-for="(item, index) in customItemList"
      :key="index"
    >
      <template #label>
        <!-- dblclick to edit the label -->
        <span
          v-if="!item.isEditing"
          @dblclick="item.isEditing = true"
        >{{ item.label }}</span>
        <ElInput
          v-else
          v-model="item.label"
          style="max-width: 48px"
          autofocus
          maxlength="10"
          @blur="disableEditing(item)"
          @keyup.enter="disableEditing(item)"
        />
      </template>
      <ElRow>
        <ElCol :span="23">
          <ElInput v-model="item.value" />
        </ElCol>
        <ElCol :span="1">
          <ElTooltip content="Delete the property">
            <ElIcon
              style="cursor: pointer; margin: 5px"
              @click="deleteProperty(index)"
            >
              <component is="close" />
            </ElIcon>
          </ElTooltip>
        </ElCol>
      </ElRow>
    </ElFormItem>
  </ElForm>
  <div
    v-if="!isBlank"
    class="align-right"
  >
    <ElButton
      v-if="hasDescForm"
      size="small"
      @click="addProperty"
    >
      Add Property
    </ElButton>
    <ElButton
      type="primary"
      size="small"
      @click="applyChanges"
    >
      Apply
    </ElButton>
  </div>
  <ElEmpty
    v-if="isBlank"
    content="No Data"
    :image-size="100"
  />
</template>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 5px;
}

.align-right {
  display: flex;
  justify-content: right;
}
</style>

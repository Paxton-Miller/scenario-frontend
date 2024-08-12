<!--
  @name: CustomMapDialog
  @description: TODO
  @author: Lingkai Shi
  @date: 8/2/2024 2:49 PM
  @version: 1.0
-->

<script setup lang="ts">
import { Graph } from '@antv/x6'
import { inject, onMounted, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { fromLonLat } from 'ol/proj'
import type { Feature, View } from 'ol'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { addMap, getAllOpenMap } from '@/api/MapApi'
import type { GetAllMapResponse, Map } from '@/api/class/Map'
import { addGeoJson, addGeoJsonByFile } from '@/api/GeoJsonApi'
import { isEmpty } from '@/utils/StringTool'

defineProps({
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
const listRef = ref()
const formRef = ref<FormInstance>()
const mapRef = ref()
const viewRef = ref<View>()
const vectorSourceRef = ref()
const baseLayerRef = ref(null)
const vectorLayerRef = ref()
const zoom = ref<number>(13)
const center = ref(fromLonLat([118.91302961952465, 32.10708019478149]))
const mapTitle = ref<string>('Base Map')
const mapUrl = ref<string>('http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=en&size=1&scl=1&style=7')
const mapAttributions = ref<string>(`©${new Date().getFullYear()}高德软件 GS(2023)4677号`)
const format = inject('ol-format')
const formatGeoJson = new format.GeoJSON()

const form = ref({
  map: 0,
  name: '',
  type: 'content',
  jsonContent: '',
  jsonFile: {},
  vectorUrl: '',
})

const openMapList = ref<Map[]>()

const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input map name', trigger: 'blur' },
  ],
  jsonContent: [
    {
      validator(rule, value, callback, source, options) {
        try {
          const json = JSON.parse(value)
          const parsedFeatures = formatGeoJson.readFeatures(json)

          if (parsedFeatures.length === 0)
            callback(new Error('The GeoJSON contains no features.'))
          else
            callback()
        }
        catch (e) {
          if (!isEmpty(value))
            callback(new Error('Invalid GeoJSON format.'))
        }
      },
      trigger: 'blur',
    },
  ],
})

// when getting the local image
const handleFileChange = async (file: File) => {
  if (file.size / 1024 > 200) {
    ElMessage.warning('Must be less than 200k')

    return
  }
  const uploadFormData = new FormData()

  uploadFormData.append('file', (file as any).raw)

  const url = await addGeoJsonByFile(uploadFormData) as unknown as string

  form.value.vectorUrl = url
}

const handleMapChange = (value: any) => {
  mapTitle.value = openMapList.value![value].name
  mapUrl.value = openMapList.value![value].mapUrl
  mapAttributions.value = openMapList.value![value].attributions
}

const handleInputChange = async (value: string) => {
  if (!formRef.value)
    return

  // async (valid, fields)
  await formRef.value.validate(async valid => {
    if (valid) {
      let json
      try {
        json = JSON.parse(value)
      }
      catch (e) {
        return
      }
      const result = await addGeoJson(json) as unknown as string

      form.value.vectorUrl = result
    }
  })
}

const submit = async (formValidator: FormInstance | undefined) => {
  if (!formValidator)
    return

  // async (valid, fields)
  await formValidator.validate(async valid => {
    if (valid) {
      const param = {
        accessLevel: 'restricted',
        attributions: mapAttributions.value,
        logoUrl: openMapList.value![form.value.map].logoUrl,
        mapUrl: mapUrl.value,
        name: form.value.name,
        vectorUrl: form.value.vectorUrl,
      }

      const result = await addMap(param)
      if (result) {
        ElMessage.success('Done')
        emits('closeAdd')
      }
    }
  })
}

const getOpenMapList = async () => {
  const result = await getAllOpenMap() as unknown as GetAllMapResponse
  if (result && result.totalCount > 0) {
    openMapList.value = result.list
    mapTitle.value = result.list[0].name
    mapUrl.value = result.list[0].mapUrl
    mapAttributions.value = result.list[0].attributions
  }
}

const getText = (feature: Feature) => {
  return new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.6)',
    }),
    stroke: new Stroke({
      color: '#319FD3',
      width: 1,
    }),
    text: new Text({
      text: feature.get('name'),
    }),
  })
}

onMounted(() => {
})
onBeforeMount(async () => {
  await getOpenMapList()
})
</script>

<template>
  <ElDialog
    :model-value="dialog"
    width="45%"
    :before-close="() => emits('closeAdd')"
  >
    <template #header>
      <span>Custom Map</span>
    </template>
    <ElRow :gutter="12">
      <ElCol :span="12">
        <div class="grid-content ep-bg-purple">
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
                placeholder="Please input the map name"
              />
            </ElFormItem>
            <ElFormItem
              label="BaseMap"
              prop="map"
            >
              <ElSelect
                v-model="form.map"
                @change="handleMapChange"
              >
                <ElOption
                  v-for="(item, index) in openMapList"
                  :key="index"
                  :label="item.name"
                  :value="index"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label="Import By"
              prop="type"
            >
              <div class="my-2 ml-4">
                <ElRadioGroup v-model="form.type">
                  <ElRadio value="content">
                    Paste
                  </ElRadio>
                  <ElRadio value="file">
                    Upload
                  </ElRadio>
                </ElRadioGroup>
              </div>
            </ElFormItem>
            <ElFormItem
              v-if="form.type === 'content'"
              label="Paste"
              prop="jsonContent"
            >
              <ElInput
                v-model="form.jsonContent"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 10 }"
                placeholder="Please paste the geojson content"
                @change="handleInputChange"
              />
            </ElFormItem>
            <ElFormItem
              v-if="form.type === 'file'"
              label="Upload"
              prop="jsonFile"
            >
              <ElUpload
                action=""
                drag
                accept=".json"
                :auto-upload="false"
                style="width: 100%;"
                class="upload-demo"
                :on-change="handleFileChange"
                :show-file-list="false"
              >
                <ElIcon class="el-icon--upload">
                  <component is="uploadFilled" />
                </ElIcon>
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    GeoJSON file with a size less than 200kb
                  </div>
                </template>
              </ElUpload>
            </ElFormItem>
          </ElForm>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="grid-content ep-bg-purple-light map-container">
          <div class="map">
            <OlMap
              ref="mapRef"
              :controls="[]"
              load-tiles-while-animating
              load-tiles-while-interacting
              style="block-size: 100%"
            >
              <OlView
                ref="viewRef"
                :center="center"
                :zoom="zoom"
                projection="EPSG:3857"
              />
              <OlTileLayer
                ref="baseLayerRef"
                :title="mapTitle"
              >
                <OlSourceXyz
                  :url="mapUrl"
                  :attributions="mapAttributions"
                  :attributions-collapsible="false"
                  wrap-x
                  :preload="Infinity"
                />
                <OlAttributionControl />
              </OlTileLayer>
              <OlVectorLayer
                v-if="form.vectorUrl !== ''"
                ref="vectorLayerRef"
                title="vector"
              >
                <OlSourceVector
                  ref="vectorSourceRef"
                  :url="form.vectorUrl"
                  projection="EPSG:3857"
                  :format="formatGeoJson"
                >
                  <OlStyle :override-style-function="getText" />
                </OlSourceVector>
              </OlVectorLayer>
              <OlFullscreenControl />
            </OlMap>
          </div>
          <ElButton
            size="small"
            circle
            class="map-component"
            icon="delete"
            @click="form.vectorUrl = ''"
          />
        </div>
      </ElCol>
    </ElRow>
    <div
      class="align-right"
      style="margin-top: 5px"
    >
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
    </div>
  </ElDialog>
</template>

<style scoped lang="scss">
.align-right {
  display: flex;
  justify-content: flex-end;
}

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
}

.map-component {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

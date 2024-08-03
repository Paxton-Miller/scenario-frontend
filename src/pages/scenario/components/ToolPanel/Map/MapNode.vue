<!--
  @name: MapNode
  @description: TODO
  @author: Lingkai Shi
  @date: 7/31/2024 11:32 AM
  @version: 1.0
-->

<script setup lang="ts">
// eslint-disable-next-line import/extensions
import 'ol/dist/ol.js'
import { fromLonLat, toLonLat } from 'ol/proj'
import { inject, onMounted, ref } from 'vue'
import type { Feature, Map, View } from 'ol'
import type { Node } from '@antv/x6'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { sendMsg } from '@/pages/scenario/components/Collaborate'
import { saveGraph } from '@/pages/scenario/components/Graph'

const getNode = inject('getNode') as () => Node | undefined
const node = ref<Node | undefined>(getNode())
const mapRef = ref<Map>()
const viewRef = ref<View>()
const vectorLayerRef = ref()
const layerList = ref([])
const baseLayerRef = ref(null)
const zoom = ref<number>(13)
const center = ref(fromLonLat([118.91302961952465, 32.10708019478149]))
const lastUpdateTime = ref<number>(0)
const updateInterval = ref<number>(200)
const mapTitle = ref<string>('Base Map')
const mapUrl = ref<string>('http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=en&size=1&scl=1&style=7')
const mapAttributions = ref<string>(`©${new Date().getFullYear()}高德软件 GS(2023)4677号`)
const vectorUrl = ref<string>('')

const format = inject('ol-format')
const geoJson = new format.GeoJSON()

const handleViewChange = e => {
  // Avoid updating too fast(cause zooming failed)
  const now = Date.now()
  if (now - lastUpdateTime.value < updateInterval.value)
    return
  else lastUpdateTime.value = now

  // No.1 Send the node and mapView to other users through WebSocket
  sendMsg(JSON.stringify({
    event: 'view:change',
    data: getNode(),
    mapView: (mapRef.value as any).map.getView(),
  }))

  saveGraph()
}

const refreshView = () => {
  zoom.value = node.value?.getData().view.zoom
  center.value = node.value?.getData().view.center
}

const handleNodeDataChange = () => {
  // No.3 Listen to No.2, and change the map.
  node.value?.on('change:data', ({ current }) => {
    const currentView = current.view

    center.value = currentView.center
    zoom.value = currentView.zoom
  })
}

const initMapParams = () => {
  mapTitle.value = node.value?.getData().map.name
  mapUrl.value = node.value?.getData().map.mapUrl
  mapAttributions.value = node.value?.getData().map.attributions
  vectorUrl.value = node.value?.getData().map.vectorUrl

  // 'https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=320113'
  // vectorUrl.value = 'http://localhost:8898/geojson/66ab315ca4c83ac0fd0496be'
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
  const map = (mapRef.value! as any).map
  const view = (viewRef.value! as any).view

  console.log(map.getView())
  console.log(toLonLat(view.getCenter()))
  console.log(view.getZoom())

  const baseLayer = (baseLayerRef.value! as any).tileLayer

  layerList.value.push(baseLayer)
  refreshView()
  initMapParams()
  handleNodeDataChange()
})
</script>

<template>
  <div class="map-container">
    <div id="map">
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
          @change="handleViewChange"
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
          v-if="vectorUrl !== ''"
          ref="vectorLayerRef"
          title="vector"
        >
          <OlSourceVector
            :url="vectorUrl"
            projection="EPSG:3857"
            :format="geoJson"
          >
            <OlStyle :override-style-function="getText" />
          </OlSourceVector>
        </OlVectorLayer>
        <OlFullscreenControl />
      </OlMap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#map {
  padding: 0;
  block-size: 100%;
  inline-size: 100%;
  margin-block: 0;
  margin-inline: auto;
}

.ol-control.ol-legend {
  z-index: 1;
  inset-block-end: 1.5em;
  inset-inline-start: 1.3em;
  max-block-size: 41%;
  max-inline-size: 90%;
}
</style>

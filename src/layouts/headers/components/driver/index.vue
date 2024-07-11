<script setup>
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import { onMounted } from 'vue'
import { steps } from './steps'

let driver
onMounted(() => {
  initDriver()
})

const initDriver = () => {
  driver = new Driver({
    animate: false, // Whether to animate or not
    opacity: 0.75, // Background opacity (0 means only popovers and without overlay)
    padding: 10, // Distance of element from around the edges
    allowClose: true, // Whether the click on overlay should close or not
    overlayClickNext: false, // Whether the click on overlay should move next
    stageBackground: '#ffffff', // Background color for the staged behind highlighted element
  })
}

const handleGuide = () => {
  driver.defineSteps(steps(t))
  driver.start()
}
</script>

<template>
  <div
    id="guide"
    @click.prevent.stop="handleGuide"
  >
    <SvgIcon icon="guide" />
  </div>
</template>

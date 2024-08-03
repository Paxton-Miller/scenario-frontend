/**
 * @name: plugins
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 5/13/2024 10:52 PM
 * @version: 1.0
 */
import type { App } from 'vue'
import ant from 'ant-design-vue'
import OpenLayersMap from 'vue3-openlayers'
import { router } from '@/plugins/router/index'
import { store } from '@/plugins/pinia'
import { registerElIcons } from '@/plugins/el-icons'

export const registerPlugins = (app: App) => {
  app.use(router)
  app.use(ant)
  app.use(store)
  app.use(OpenLayersMap)
  registerElIcons(app)
}

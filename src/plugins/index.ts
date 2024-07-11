/**
 * @name: plugins
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 5/13/2024 10:52 PM
 * @version: 1.0
 */
import type { App } from 'vue'
import { router } from '@/plugins/router/index'
import { store } from '@/plugins/pinia'
import { registerElIcons } from '@/plugins/el-icons'

export const registerPlugins = (app: App) => {
  app.use(router)
  app.use(store)
  registerElIcons(app)
}

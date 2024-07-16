import { createApp } from 'vue'

import App from '@/App.vue'

// Plugins
import { registerPlugins } from '@/plugins/index'

// Styles
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import 'ant-design-vue/dist/antd.css'

// Create vue app
const app = createApp(App)

registerPlugins(app)

// Mount vue app
app.mount('#app')

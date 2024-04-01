// custom style
import './styles/index.css'
import './styles/common.css'
import './styles/animate.css'

import 'highlight.js/styles/github.css'

// 或其他样式

// unocss
import 'uno.css'
import '@unocss/reset/tailwind.css'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// vue
import { createApp } from 'vue'

import { router } from './router'
import { pinia } from './store'
import App from './App.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')

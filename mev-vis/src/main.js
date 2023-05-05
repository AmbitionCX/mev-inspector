import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './index.css'

createApp(App).use(store).use(ElementPlus).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

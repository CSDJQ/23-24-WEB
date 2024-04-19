import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import './assets/css/global.css';
import * as echarts from "echarts";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

// 注册 Element Plus
app.use(ElementPlus)

// 使用路由
app.use(router)


// 挂载应用程序
app.mount('#app')

app.config.globalProperties.$echarts = echarts;

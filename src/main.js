import { createApp } from 'vue'

import App from './App.vue'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import './assets/common.css'

import routes from './router/index'
import store from './store/index'
import directive from './directives/index'
const app = createApp(App);
//注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
//全局配置
app.config.globalProperties.test = 111;
app.use(routes)
    .use(store)
    .use(directive)
    .mount('#app')
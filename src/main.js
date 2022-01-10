import { createApp } from 'vue'

import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import routes from './router/index'
import store from './store/index'

const app = createApp(App);
//全局配置
app.config.globalProperties.test = 111;
app.use(ElementPlus, {
    locale: zhCn,
})
    .use(routes)
    .use(store)
    .mount('#app')

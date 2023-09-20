import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//自动引入element plus组件库
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const pathSrc = path.resolve(__dirname, 'src')
export default ({ command, mode }) => {
    const basePublicPath = mode == 'development' ? '/' : '/';
    return defineConfig({
        base: basePublicPath,
        resolve: {
            alias: {
                '@': pathSrc,
            },
        },
        css: {
            preprocessorOptions: {
                //配置全局less
                less: {
                    additionalData: `
                            @base: ${basePublicPath};
                            @import "${path.resolve(__dirname, 'src/assets/mixin.less')}";
                          `
                }
            }
        },
        plugins: [
            vue(),
            AutoImport({
                // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
                imports: ['vue', 'vue-router'],
                // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
                resolvers: [
                    ElementPlusResolver(),

                ],
                dts: true,
                // 遍历子目录
                deep: true
            }),
            Components({
                resolvers: [
                    // 自动导入 Element Plus 组件
                    ElementPlusResolver(),
                ],
                dts: true,
                // 遍历子目录
                deep: true
            }),
        ],
        server: {
            port: 8082,
            open: true
        }
    })
}
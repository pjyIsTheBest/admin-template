import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
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
        plugins: [vue()],
        server: {
            port: 8082,
            open: true
        }
    })
}
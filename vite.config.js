import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

export default ({ command, mode }) => {
  const basePublicPath = mode == 'development' ? '/' : '/';
  return defineConfig({
    base: basePublicPath,
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
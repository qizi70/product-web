import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 读取当前模式的环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_NODE_CODE == 'develop' ? '/' : '/product-web/',
    build: {
      outDir: 'dist',
    },
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})

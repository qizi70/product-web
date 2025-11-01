import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

type Env = {
  VITE_PORT?: string, // 端口号
  VITE_OPEN?: string, // 自动打开浏览器
  VITE_PUBLIC_PATH?: string, // public path 配置线上环境路径（打包）、本地通过 http-server 访问时，请置空即可
  VITE_STATIC_BASE?: string, // 打包后静态文件找的的根地址
  VITE_API_BASEURL?: string,
}

// https://vite.dev/config/
export default defineConfig((config) => {
  // 根据当前工作目录中的 `config` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env: Env = loadEnv(config, process.cwd(), '')

  return {
    base: env.VITE_NODE_CODE == 'develop' ? '/' : '/product-web/',
    root: process.cwd(),
    build: {
      outDir: 'dist',
    },
    server: {
      hmr: true,
      host: 'localhost',
      port: env.VITE_PORT,
      open: false, //服务启动时自动在浏览器中打开应用
      strictPort: false, // 如果端口已占用是否直接退出
      proxy: getProxy(config.command)
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
    compilerOptions: {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }
})

type Command = 'serve' | 'build'
function getProxy(command: Command) {
  const proxy = {
    // '/api': {
    //   target: 'https://dev-student.htexam.com/',
    //   ws: true,
    //   changeOrigin: true,
    //   rewrite: (path: String) => path.replace(/^\/studentApi/, ''),
    // }
  }
  if (command == 'serve') {
    proxy['/api'] = { // 不走 axios 的接口临时用
      target: 'http://localhost:8081',
      ws: true,
      changeOrigin: true,
    }
  }

  return proxy
}

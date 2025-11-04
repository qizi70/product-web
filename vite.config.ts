import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode, command }) => {
  // 👇 关键：mode 就是 'development' 或 'production'
  const env = loadEnv(mode, process.cwd())

  console.log('当前模式:', mode)
  console.log('env.VITE_NODE_CODE:', env.VITE_NODE_CODE)

  return {
    base: env.VITE_NODE_CODE === 'development' ? '/' : '/product-web/',
    build: {
      outDir: 'dist',
    },
    server: {
      host: 'localhost',
      port: env.VITE_PORT || 3000,
      proxy: getProxy(command),
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

function getProxy(command) {
  const proxy = {
    // '/api': {
    //   target: 'http://47.93.3.30:8081', // 你的真实目标地址
    //   changeOrigin: true,
    //   // 添加以下 bypass 函数
    //   bypass: function (req, res, options) {
    //     // 构建代理后的真实URL
    //     const proxyUrl = new URL(req.url || '', options.target)?.href || '';
    //     // 将这个真实URL设置为响应头，方便在前端查看
    //     res.setHeader('x-req-proxyUrl', proxyUrl);

    //   }
    // }
  }
  return proxy
}

// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'    // ① 在文件顶部新增这行

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // ② 把 '@' 指向项目 src 目录
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || '')
  }
})

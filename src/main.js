// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import api from '@/services/api'          
import './style.css'

import { useAuthStore } from '@/store/auth'


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)                          
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// 2. 拿 token，写到 axios 默认 header
const token = localStorage.getItem('token')  // key 和 store 里用的一致
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// 3. 如果有 token，就拿着它去拉当前用户
const auth = useAuthStore()
if (auth.accessToken) {
  auth.fetchCurrentUser()  // ← 这里要和你在 store 里定义的方法名一致
}

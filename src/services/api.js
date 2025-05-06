import axios from 'axios'
import { useAuthStore } from '@/store/auth'

// 读取 .env 文件里配置的后端地址
const baseURL = import.meta.env.VITE_API_BASE_URL 

const api = axios.create({
  baseURL,
  timeout: 10_000,
})

// 请求拦截：自动带上 token
api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

// 响应拦截：全局处理 401、错误提示等
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // token 过期或未登录，跳转登录页
      window.location.href = '/login/'
    }
    return Promise.reject(err)
  }
)

export default api

import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

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
  console.log('发送请求:', {
    url: config.url,
    method: config.method,
    data: config.data,
    params: config.params,
    headers: config.headers,
    baseURL: config.baseURL
  })
  return config
}, error => {
  console.error('请求拦截器错误:', error)
  return Promise.reject(error)
})

// 响应拦截：全局处理 401、错误提示等
api.interceptors.response.use(
  res => {
    console.log('收到响应:', {
      url: res.config.url,
      status: res.status,
      data: res.data,
      headers: res.headers
    })
    return res
  },
  err => {
    console.error('请求错误:', {
      url: err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
      headers: err.config?.headers
    })
    
    if (err.response?.status === 401) {
      const router = useRouter()
      // token 过期或未登录，跳转登录页
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default api

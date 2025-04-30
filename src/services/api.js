import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const baseURL = __API_BASE_URL__ || '/api'
const api = axios.create({ baseURL, timeout: 5000 })

api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.accessToken) config.headers.Authorization = `Bearer ${auth.accessToken}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      window.location = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 从 localStorage 恢复
    accessToken: localStorage.getItem('token') || '',
    user: null
  }),
  getters: {
    // 只要有 token，就算「已认证」
    isAuth: (state) => !!state.accessToken
  },
  actions: {
    // 登录：先拿 token，然后设置 header，再拉用户信息
    async login({ username, password }) {
      const res = await api.post('/login/', { username, password })
      this.accessToken = res.data.access
      // 持久化
      localStorage.setItem('token', this.accessToken)
      // 把 token 注入到后续所有请求
      api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
      // 拉当前用户
      await this.fetchCurrentUser()
    },
    // 拉取当前用户信息
    async fetchCurrentUser() {
      const res = await api.get('/userinfo/')
      this.user = res.data
    },
    // 登出
    logout() {
      this.accessToken = ''
      this.user = null
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      // 跳到登录
      window.location.href = '/login'
    }
  }
})

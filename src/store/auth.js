import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('token') || '',
    user: null,
  }),
  actions: {
    async login({ username, password }) {
      const res = await api.post('/login/', { username, password })
      this.accessToken = res.data.access
      this.user = res.data.user
      localStorage.setItem('token', this.accessToken)
    },
    logout() {
      this.accessToken = ''
      this.user = null
      localStorage.removeItem('token')
      window.location.href = '/login/'
    },
    setToken(token) {
      this.accessToken = token
      localStorage.setItem('token', token)
    },
    setUser(user) {
      this.user = user
    }
  }
})

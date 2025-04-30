import { defineStore } from 'pinia'
import api from '@/services/api'

export const useUserStore = defineStore('user', {
  state: () => ({ profile: null, token: '' }),
  actions: {
    async fetchProfile() {
      const res = await api.get('/userinfo')
      this.profile = res.data
    },
    setToken(token) { this.token = token }
  },
})
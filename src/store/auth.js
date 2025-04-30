import { defineStore } from 'pinia'
import { login as svcLogin, register as svcRegister } from '@/services/auth'
import { getProfile } from '@/services/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({ accessToken: localStorage.getItem('access') || '', refreshToken: localStorage.getItem('refresh') || '', user: null }),
  getters: { isLoggedIn: state => !!state.accessToken },
  actions: {
    async login(creds) {
      const res = await svcLogin(creds)
      this.accessToken = res.data.access
      this.refreshToken = res.data.refresh
      localStorage.setItem('access', this.accessToken)
      localStorage.setItem('refresh', this.refreshToken)
      const profile = await getProfile()
      this.user = profile.data
    },
    async register(creds) { await svcRegister(creds) },
    logout() { this.accessToken = ''; this.refreshToken = ''; this.user = null; localStorage.clear() }
  }
})

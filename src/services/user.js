import api from './api'
export function getProfile() { return api.get('/userinfo') }
export function updateProfile(data) { return api.patch('/userinfo/me/', data) }
import api from './api'

export function getProfile() {
  return api.get('/userinfo')
}

export function updateProfile(data) {
  return api.patch('/userinfo/me/', data)
}

export function getUser(id) {
  return api.get(`/userinfo/${id}/`)
}

export function getFollowings() {
  return api.get('/user/follow/')
}

export function followUser(id) {
  return api.post('/user/follow/', { user_id: id })
}

export function unfollow(followId) {
  return api.delete(`/user/follow/${followId}/`)
}


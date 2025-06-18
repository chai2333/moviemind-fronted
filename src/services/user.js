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
  return api.get('/interact/follow/')
}

export function followUser(id) {
  return api.post('/interact/follow/', { followed_id: id })
}

export function unfollow(followId) {
  return api.delete(`/interact/follow/${followId}/`)
}


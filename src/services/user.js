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
  // 获取当前用户的关注列表，默认一次取完
  return api.get('/interact/follow/', { params: { limit: 1000, offset: 0 } })
}

export function followUser(id) {
  return api.post('/interact/follow/', { followed_id: id })
}

export function unfollow(followId) {
  return api.delete(`/interact/follow/${followId}/`)
}


import api from './api'
import { useAuthStore } from '@/store/auth'

export function getProfile() {
  return api.get('/userinfo')
}

export function updateProfile(data) {
  return api.patch('/userinfo/me/', data)
}

export function getUser(id) {
  return api.get('/userinfo/getbyid', {
    params: { user_id: id }
  })
}

export function getFollowings() {
  return api.get('/interact/follow/')
}

export function getFollowers() {
  return api.get('/interact/follow/')
}

export async function toggleFollow(followedId) {
  try {
    console.log('开始关注操作:', { followedId })
    
    // 检查 followedId 是否有效
    if (!followedId) {
      throw new Error('无效的用户ID')
    }
    
    // 检查是否已登录
    const auth = useAuthStore()
    if (!auth.accessToken) {
      throw new Error('请先登录')
    }
    
    const response = await api.post('/interact/follow/', { followed_id: followedId })
    console.log('关注操作成功:', response.data)
    
    // 确保返回正确的关注状态
    return {
      ...response,
      data: {
        ...response.data,
        is_following: response.data.is_following ?? true
      }
    }
  } catch (error) {
    console.error('关注操作失败:', {
      error,
      response: error.response?.data,
      status: error.response?.status,
      message: error.message
    })
    throw error
  }
}

export function getLikes() {
  return api.get('/interact/like/')
}

export function getHistory() {
  return api.get('/interact/history/')
}

export function getCollects() {
  return api.get('/interact/collect/')
}

export function getComments() {
  return api.get('/interact/comment/')
}


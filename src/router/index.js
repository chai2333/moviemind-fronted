import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MovieList from '@/views/MovieList.vue'
import Recommend from '@/views/Recommend.vue'
import Search from '@/views/Search.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import MovieDetail from '@/views/MovieDetail.vue'
import { useAuthStore } from '@/store/auth'
import { ElMessage } from 'element-plus'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'MovieList', component: MovieList },
  { path: '/ai', name: 'Recommend', component: Recommend },
  { path: '/search', name: 'Search', component: Search },
  { path: '/movie/:id', name: 'MovieDetail', component: MovieDetail, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/user', name: 'UserProfile', component: () => import('@/views/UserProfile.vue'), meta: { requiresAuth: true } },
  { path: '/admin/reports', name: 'AdminReport', component: () => import('@/views/AdminReport.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/profile', name: 'Profile', component: () => import('@/views/UserProfile.vue'), meta: { requiresAuth: true } },
  { path: '/history/:type', name: 'HistoryDetail', component: () => import('@/views/HistoryDetail.vue'), props: true },
  { path: '/viewed', name: 'ViewedPage', component: () => import('@/views/ViewedPage.vue'), meta: { requiresAuth: true } },
  { path: '/favorites', name: 'FavoritesPage', component: () => import('@/views/FavoritesPage.vue'), meta: { requiresAuth: true } },
  { path: '/liked', name: 'LikedPage', component: () => import('@/views/LikedPage.vue'), meta: { requiresAuth: true } },
  { path: '/commented', name: 'CommentsPage', component: () => import('@/views/CommentsPage.vue'), meta: { requiresAuth: true } },
  {
    path: '/admin/movies',
    name: 'AdminMovies',
    component: () => import('@/views/AdminMovies.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  // 如果需要认证
  if (to.meta.requiresAuth) {
    // 如果没有token，跳转到登录页
    if (!auth.accessToken) {
      return next({ name: 'Login' })
    }
    
    // 如果用户信息不存在，尝试获取
    if (!auth.user) {
      try {
        await auth.fetchCurrentUser()
      } catch (err) {
        // 如果获取用户信息失败，清除token并跳转到登录页
        auth.logout()
        return next({ name: 'Login' })
      }
    }
  }
  
  next()
})

export default router
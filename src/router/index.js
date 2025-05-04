import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MovieList from '@/views/MovieList.vue'
import Recommend from '@/views/Recommend.vue'
import Search from '@/views/Search.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import MovieDetail from '@/views/MovieDetail.vue'
import { useAuthStore } from '@/store/auth'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'MovieList', component: MovieList },
  { path: '/ai', name: 'Recommend', component: Recommend },
  { path: '/search', name: 'Search', component: Search },
  { path: '/movie/:id', name: 'MovieDetail', component: MovieDetail, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/user', name: 'UserProfile', component: () => import('@/views/UserProfile.vue'), meta: { requiresAuth: true } },
  { path: '/admin/reports', name: 'AdminReport', component: () => import('@/views/AdminReport.vue'), meta: { requiresAuth: true, adminOnly: true } },
  { path: '/profile', name: 'Profile', component: () => import('@/views/UserProfile.vue'), meta: { requiresAuth: true } },
  { path: '/history/:type', name: 'HistoryDetail', component: () => import('@/views/HistoryDetail.vue'), props: true },
  { path: '/history/viewed', name: 'ViewedPage', component: () => import('@/views/ViewedPage.vue') },
  { path: '/history/favorites', name: 'FavoritesPage', component: () => import('@/views/FavoritesPage.vue') },
  { path: '/history/liked', name: 'LikedPage', component: () => import('@/views/LikedPage.vue') },
  { path: '/history/comments', name: 'CommentsPage', component: () => import('@/views/CommentsPage.vue') }
  
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.accessToken) return next({ name:'Login' })
  next()
})

export default router
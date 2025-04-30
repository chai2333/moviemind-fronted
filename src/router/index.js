import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MovieList from '@/views/MovieList.vue'
import Recommend from '@/views/Recommend.vue'
import Search from '@/views/Search.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import MovieDetail from '@/views/MovieDetail.vue'
import Admin from '@/views/Admin.vue'
import { useAuthStore } from '@/store/auth'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'MovieList', component: MovieList },
  { path: '/ai', name: 'Recommend', component: Recommend },
  { path: '/search', name: 'Search', component: Search },
  { path: '/movie/:id', name: 'MovieDetail', component: MovieDetail, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.accessToken) return next({ name:'Login' })
  next()
})

export default router
<template>
  <header class="navbar">
    <!-- Logo + 标题 -->
    <img src="@/assets/logo.png" class="navbar-logo" alt="logo" />
    <span class="navbar-title">观影济</span>

    <!-- 菜单 -->
    <nav class="navbar-menu">
      <router-link
        to="/movies"
        class="navbar-menu-item"
        active-class="active"
      >
        热门电影榜单
      </router-link>
      <router-link
        to="/ai"
        class="navbar-menu-item"
        active-class="active"
      >
        AI 推荐助手
      </router-link>
    </nav>

    <!-- 搜索框 -->
    <div class="navbar-search">
      <input
        v-model="keyword"
        @keyup.enter="onSearch"
        type="text"
        placeholder="搜索电影..."
      />
      <i class="el-icon-search icon-search" @click="onSearch"></i>
    </div>

    <!-- 账户区 -->
    <div class="navbar-account">
      <!-- 已登录：显示头像+用户名 -->
      <template v-if="isAuth">
        <div class="user-info" @click="goProfile">
          <img
            :src="auth.user.avatar || defaultAvatar"
            class="avatar"
            alt="头像"
          />
          <span class="username">{{ auth.user.username }}</span>
        </div>
      </template>
      <!-- 未登录：显示 登录/注册 -->
      <template v-else>
        <router-link to="/login" class="auth-link">登录</router-link>
        <router-link to="/register" class="auth-link">注册</router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'
import defaultAvatar from '@/assets/default-avatar.png'

const router = useRouter()
const auth = useAuthStore()

// 只要有 user 对象，就算已登录
const isAuth = computed(() => !!auth.user)

// 搜索关键词
const keyword = ref('')

// 页面刷新时尝试从 localStorage 恢复 token 并拉取用户信息
onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  if (token && !auth.user) {
    auth.accessToken = token
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    await auth.fetchCurrentUser()
  }
})

function onSearch() {
  if (keyword.value.trim()) {
    router.push({ name: 'Search', query: { q: keyword.value.trim() } })
  }
}

function goProfile() {
  router.push({ name: 'Profile' }).catch(() => {})
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-logo {
  height: 40px;
  margin-right: 8px;
}

.navbar-title {
  font-size: 20px;
  font-weight: bold;
  margin-right: 32px;
}

.navbar-menu {
  display: flex;
  flex: none;
}

.navbar-menu-item {
  margin: 0 12px;
  padding: 16px 0;
  color: #333;
}

.navbar-menu-item.active {
  color: #5c6bc0;
  position: relative;
}

.navbar-menu-item.active::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #5c6bc0;
}

.navbar-search {
  flex: 1;
  max-width: 300px;
  position: relative;
  margin: 0 16px;
}

.navbar-search input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
}

.icon-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
}

.navbar-account {
  display: flex;
  align-items: center;
}

.auth-link {
  margin-left: 12px;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.username {
  font-weight: 500;
  color: #333;
}
</style>

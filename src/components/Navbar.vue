<template>
  <header class="navbar">
    <!-- Logo + 标题 -->
    <img src="@/assets/logo.png" class="navbar-logo" alt="logo" />
    <span class="navbar-title">观影济</span>

    <!-- 菜单 -->
    <nav class="navbar-menu">
      <router-link to="/movies" class="navbar-menu-item" active-class="active">
        热门电影榜单
      </router-link>
      <router-link to="/ai" class="navbar-menu-item" active-class="active">
        AI 推荐助手
      </router-link>
    </nav>

    <!-- 搜索框 -->
    <div class="navbar-search">
      <input v-model="keyword" @keyup.enter="onSearch" placeholder="Search" />
      <i class="el-icon-search icon-search" @click="onSearch"></i>
    </div>

    <!-- 账户区：已登录显示头像+用户名，未登录显示 登录/注册 -->
    <div class="navbar-account">
      <template v-if="isAuth">
        <img :src="auth.user.avatar || '/default-avatar.png'" class="avatar" alt="头像" />
        <span class="username">{{ auth.user.username }}</span>
      </template>
      <template v-else>
        <router-link to="/login" class="auth-link">登录</router-link>
        <router-link to="/register" class="auth-link">注册</router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()
const isAuth = computed(() => !!auth.accessToken)
const keyword = ref('')

function onSearch() {
  if (keyword.value) {
    router.push({ name: 'Search', query: { q: keyword.value } })
  }
}
</script>

<style scoped>

</style>

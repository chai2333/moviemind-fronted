<template>
    <div class="home-hero">
      <div class="overlay">
        <h1 class="title">观影济</h1>
        <p class="subtitle">打破信息茧房，遇见优秀电影</p>
        <el-button
          v-if="!isAuth"
          type="primary"
          size="large"
          @click="goLogin"
        >
          登录 / 注册
        </el-button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  
  const router = useRouter()
  const auth = useAuthStore()
  const isAuth = computed(() => !!auth.accessToken)
  function goLogin() {
    router.push({ name: 'Login' })
  }
  </script>
  
  <style scoped>
  .home-hero {
    position: relative;
    height: calc(100vh - 64px);
    background: url('@/assets/homepage.png') center/cover no-repeat;
  }
  .overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    background: rgba(0,0,0,0.4);
    color: #fff; text-align: center;
  }
  .title { font-size: 64px; margin-bottom: 16px; }
  .subtitle { font-size: 24px; margin-bottom: 32px; }
  </style>
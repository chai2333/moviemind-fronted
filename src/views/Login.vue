<template>
  <div class="auth-page">
    <div class="auth-overlay"></div>
    <div class="auth-card">
      <div class="auth-header">
        <img src="@/assets/logo.png" class="navbar-logo" alt="logo" />
        <span class="navbar-title">观影济</span>
      </div>
      <el-form @submit.prevent="onSubmit" :model="form" label-width="0">
        <el-form-item prop="identifier">
          <el-input
            v-model="form.identifier"
            placeholder="用户ID / 手机号 / 邮箱"
            class="input-field"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            class="input-field"
          />
        </el-form-item>
        <!-- <div class="auth-links">
          <span class="link">短信登录</span>
          <span class="link">忘记密码</span>
        </div> -->
        <el-form-item>
          <el-button type="primary" class="auth-btn" @click="onSubmit">
            登录
          </el-button>
        </el-form-item>
        <div class="auth-footer">
          <span>还没有账号？</span>
          <router-link to="/register">注册一下</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  identifier: '',
  password: ''
})

async function onSubmit() {
  await auth.login({ username: form.identifier, password: form.password })
  router.push({ name: 'MovieList' })
}
</script>

<style scoped>
.input-field .el-input__inner {
  border-radius: 20px;
  background: #e8e8ff;
  padding: 0 16px;
}
.auth-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 12px;
  color: #5c6bc0;
}
.link {
  cursor: pointer;
}
.auth-btn {
  width: 100%;
  border-radius: 20px;
  font-size: 16px;
}
.auth-footer {
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
}
.auth-footer a {
  margin-left: 4px;
  color: #5c6bc0;
}
</style>

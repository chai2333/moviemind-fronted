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
            placeholder="用户ID"
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
import { ElMessage } from 'element-plus'
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
  try {
    await auth.login({ username: form.identifier, password: form.password })
    ElMessage.success('登录成功！')         
    router.push({ name: 'Home' })
  } catch (err) {
    const msg = err.response?.data?.detail
              || err.response?.data?.non_field_errors?.[0]
              || '登录失败，请检查用户名或密码'
    ElMessage.error(msg)                
  }
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

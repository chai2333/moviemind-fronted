<template>
  <div class="auth-page">
    <div class="auth-overlay"></div>
    <div class="auth-card">
      <div class="auth-header">
        <img src="@/assets/logo.png" class="navbar-logo" alt="logo" />
        <span class="navbar-title">观影济</span>
      </div>
      <el-form @submit.prevent="onSubmit" :model="form" label-width="0">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="昵称"
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
          <!-- <small class="hint">* 要求密码中包含大小写字母和数字，至少8位</small> -->
        </el-form-item>
        <!-- <el-form-item prop="confirm">
          <el-input
            v-model="form.confirm"
            type="password"
            placeholder="确认密码"
            class="input-field"
          />
          <small class="hint">* 要求此次密码和上次一致</small>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="手机号"
            class="input-field"
          />
        </el-form-item>
        <el-form-item prop="captcha" class="captcha-row">
          <el-input
            v-model="form.captcha"
            placeholder=""
            class="input-field captcha-input"
          />
          <el-button type="text" class="send-btn" @click="sendCaptcha">
            发送验证码
          </el-button>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" class="auth-btn" @click="onSubmit">
            注册
          </el-button>
        </el-form-item> 
        <div class="auth-footer">
          <span>已有账号？</span>
          <router-link to="/login">登录一下</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({
  username: '',
  password: '',
  confirm: '',
  phone: '',
  captcha: ''
})


// async function onSubmit() {
//   await register({
//     username: form.username,
//     password: form.password
//   })
//   router.push({ name: 'Login' })
// }
async function onSubmit() {
  try {
    await register({
      username: form.username,
      password: form.password
    })
    ElMessage.success('注册成功，请登录！')       // ← 新增：注册成功提示
    router.push({ name: 'Login' })
  } catch (err) {
    // 从后端返回里提取错误信息
    const data = err.response?.data || {}
    let msg = '注册失败'
    if (data.username)      msg = data.username[0]
    else if (data.password) msg = data.password[0]
    else if (data.detail)   msg = data.detail
    ElMessage.error(msg)    // ← 新增：注册失败提示
  }
}
</script>

<style scoped>
.input-field .el-input__inner {
  border-radius: 20px;
  background: #e8e8ff;
  padding: 0 16px;
}
.hint {
  display: block;
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  margin-left: 8px;
}
.captcha-row {
  display: flex;
  align-items: center;
}
.captcha-input {
  flex: 1;
}
.send-btn {
  margin-left: 8px;
  color: #5c6bc0;
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

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
        </el-form-item>

        <el-form-item prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="手机号"
            class="input-field"
          />
        </el-form-item>

        <el-form-item prop="code">
          <el-input
            v-model="form.code"
            placeholder="验证码"
            class="input-field code-field"
          >
            <template #append>
              <el-button
                class="code-btn"
                :disabled="countdown > 0"
                @click="getCode"
              >
                <span v-if="countdown > 0">{{ countdown }}s 后重试</span>
                <span v-else>获取验证码</span>
              </el-button>
            </template>
          </el-input>
        </el-form-item>

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
import { reactive, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({
  identifier: '',
  password: '',
  phone: '',
  code: ''
})


async function onSubmit() {
  try {
    await register({
      username: form.username,
      password: form.password
    })
    ElMessage.success('注册成功，请登录！')       
    router.push({ name: 'Login' })
  } catch (err) {
    const data = err.response?.data || {}
    let msg = '注册失败'
    if (data.username)      msg = data.username[0]
    else if (data.password) msg = data.password[0]
    else if (data.detail)   msg = data.detail
    ElMessage.error(msg)    
  }
}

// 倒计时状态
const countdown = ref(0)
let timerId = null

async function getCode() {
  if (countdown.value > 0) return
  if (!form.phone) {
    ElMessage.error('请输入手机号')
    return
  }
  try {
    // TODO: 换成你自己调用发送验证码的接口
    // await auth.sendSmsCode(form.phone)
    ElMessage.success('验证码已发送')
    // 启动 60s 倒计时
    countdown.value = 60
    timerId = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timerId)
        timerId = null
      }
    }, 1000)
  } catch {
    ElMessage.error('发送验证码失败')
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

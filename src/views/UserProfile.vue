<template>
  <div class="user-profile">
    <el-tabs v-model="activeTab" tab-position="top">
      <el-tab-pane v-if="auth.user?.role !== 'admin'" label="历史记录" name="history">
        <HistoryPreview />
      </el-tab-pane>

      <el-tab-pane v-if="auth.user?.role !== 'admin'" label="个人资料" name="profile">
        <el-form :model="form" label-width="100px">
          <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
          <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
          <el-form-item label="性别"><el-input v-model="form.gender" /></el-form-item>
          <el-form-item label="电话"><el-input v-model="form.phone_number" /></el-form-item>
          <el-form-item label="年龄"><el-input type="number" v-model="form.age" /></el-form-item>
          <el-form-item label="简介"><el-input type="textarea" v-model="form.introduce" /></el-form-item>

          <el-form-item label="喜好标签">
            <el-tag v-for="(tag, index) in form.like_tags || []" :key="index" type="success" closable @close="form.like_tags.splice(index, 1)">
              {{ tag }}
            </el-tag>
            <el-input v-model="newLikeTag" placeholder="添加标签" size="small" @keyup.enter="addLikeTag" />
          </el-form-item>

          <el-form-item label="避雷标签">
            <el-tag v-for="(tag, index) in form.dislike_tags || []" :key="index" type="danger" closable @close="form.dislike_tags.splice(index, 1)">
              {{ tag }}
            </el-tag>
            <el-input v-model="newDislikeTag" placeholder="添加标签" size="small" @keyup.enter="addDislikeTag" />
          </el-form-item>

          <el-button type="primary" @click="onUpdate">更新</el-button>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="设置" name="settings">
        <el-button @click="switchAccount">切换账号</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </el-tab-pane>

      <el-tab-pane v-if="auth.user?.role === 'admin'" label="举报审核" name="report">
        <AdminReport />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import HistoryPreview from './HistoryDetail.vue'
import AdminReport from './AdminReport.vue'
import api from '@/services/api'
import { ElMessage } from 'element-plus'

const activeTab = ref('history')
const auth = useAuthStore()
const form = reactive({
  username: '',
  email: '',
  gender: '',
  phone_number: '',
  age: null,
  introduce: '',
  like_tags: [],
  dislike_tags: []
})

const newLikeTag = ref('')
const newDislikeTag = ref('')

function addLikeTag() {
  if (newLikeTag.value && !form.like_tags.includes(newLikeTag.value)) {
    form.like_tags.push(newLikeTag.value)
  }
  newLikeTag.value = ''
}

function addDislikeTag() {
  if (newDislikeTag.value && !form.dislike_tags.includes(newDislikeTag.value)) {
    form.dislike_tags.push(newDislikeTag.value)
  }
  newDislikeTag.value = ''
}

async function fetchData() {
  try {
    const res = await api.get('/userinfo')
    Object.assign(form, res.data || {})
  } catch (err) {
    console.error('获取用户信息失败:', err)
  }
}

async function onUpdate() {
  try {
    // 数据验证
    if (form.age && (isNaN(form.age) || form.age < 0 || form.age > 150)) {
      ElMessage.warning('请输入有效的年龄（0-150）')
      return
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      ElMessage.warning('请输入有效的邮箱地址')
      return
    }

    if (form.phone_number && !/^1[3-9]\d{9}$/.test(form.phone_number)) {
      ElMessage.warning('请输入有效的手机号码')
      return
    }

    // 构建更新数据对象，只包含有值的字段
    const updateData = {}
    if (form.username?.trim()) updateData.username = form.username.trim()
    if (form.email?.trim()) updateData.email = form.email.trim()
    if (form.gender?.trim()) updateData.gender = form.gender.trim()
    if (form.phone_number?.trim()) updateData.phone_number = form.phone_number.trim()
    if (form.age) updateData.age = parseInt(form.age)
    if (form.introduce?.trim()) updateData.introduce = form.introduce.trim()
    if (form.like_tags?.length) updateData.like_tags = form.like_tags
    if (form.dislike_tags?.length) updateData.dislike_tags = form.dislike_tags

    // 如果没有要更新的数据
    if (Object.keys(updateData).length === 0) {
      ElMessage.warning('没有要更新的数据')
      return
    }

    await api.patch('/userinfo/me/', updateData)
    ElMessage.success('更新成功')
    // 更新成功后重新获取用户信息
    await fetchData()
  } catch (err) {
    console.error('更新用户信息失败:', err)
    ElMessage.error(err.response?.data?.message || '更新失败')
  }
}

function switchAccount() {
  location.href = '/login'
}

function logout() {
  auth.logout()
  location.href = '/login'
}

onMounted(fetchData)
</script>

<style scoped>
.user-profile {
  padding: 20px;
  background-color: #f9f9f9;
}
.profile-title {
  font-size: 22px;
  font-weight: bold;
  color: #5c6bc0;
  margin-bottom: 20px;
}
.el-tag[type='success'] {
  background-color: #5c6bc0;
  border: none;
  color: white;
  margin: 4px;
  border-radius: 12px;
}
.el-tag[type='danger'] {
  background-color: #ef5350;
  border: none;
  color: white;
  margin: 4px;
  border-radius: 12px;
}
.el-input__inner {
  border-radius: 6px;
}
.el-button--primary {
  background-color: #5c6bc0;
  border-color: #5c6bc0;
  border-radius: 20px;
}
.el-button--primary:hover {
  background-color: #3f51b5;
  border-color: #3f51b5;
}
.el-button--danger {
  border-radius: 20px;
}
</style>

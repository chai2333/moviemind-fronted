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
import { getUserProfile, updateUserProfile } from '@/services/UserService'
import { useAuthStore } from '@/store/auth'
import HistoryPreview from './HistoryDetail.vue'
import AdminReport from './AdminReport.vue'


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
  const res = await getUserProfile()
  Object.assign(form, res || {}) 
}
async function onUpdate() {
  await updateUserProfile(form)
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

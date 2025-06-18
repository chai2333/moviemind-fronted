<template>
  <div class="user-page" v-if="user">
    <div class="profile-info">
      <div class="user-header">
        <img 
          :src="user.avatar || '/default-avatar.png'" 
          :alt="user.username"
          class="user-avatar"
          @error="handleAvatarError"
        />
        <h2>{{ user.username }}</h2>
      </div>
      <div class="user-details">
        <p><strong>用户名：</strong>{{ user.username }}</p>
        <p><strong>邮箱：</strong>{{ user.email || '未设置' }}</p>
        <p><strong>性别：</strong>{{ user.gender || '未设置' }}</p>
        <p><strong>电话：</strong>{{ user.phone_number || '未设置' }}</p>
        <p><strong>年龄：</strong>{{ user.age || '未设置' }}</p>
        <p><strong>简介：</strong>{{ user.introduce || '未设置' }}</p>
        <div class="tags-section">
          <p><strong>喜好标签：</strong></p>
          <div class="tags-container">
            <el-tag 
              v-for="tag in (user.tag || '').split(',')" 
              :key="tag" 
              type="success" 
              class="tag"
              v-if="tag"
            >
              {{ tag }}
            </el-tag>
            <span v-if="!user.tag" class="no-tags">未设置</span>
          </div>
        </div>
        <div class="tags-section">
          <p><strong>避雷标签：</strong></p>
          <div class="tags-container">
            <el-tag 
              v-for="tag in (user.dislike_tags || '').split(',')" 
              :key="tag" 
              type="danger" 
              class="tag"
              v-if="tag"
            >
              {{ tag }}
            </el-tag>
            <span v-if="!user.dislike_tags" class="no-tags">未设置</span>
          </div>
        </div>
      </div>
    </div>
    <HistoryPreview />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUser } from '@/services/user'
import HistoryPreview from './HistoryDetail.vue'

const route = useRoute()
const user = ref(null)

const handleAvatarError = (e) => {
  e.target.src = '/default-avatar.png'
}

onMounted(async () => {
  try {
    const userId = route.params.id
    console.log('获取用户信息，ID:', userId)
    const res = await getUser(userId)
    console.log('获取到的用户信息:', res.data)
    if (res.data) {
      user.value = res.data
    } else {
      console.error('未获取到用户信息')
      ElMessage.error('用户不存在')
    }
  } catch (err) {
    console.error('获取用户信息失败', err)
    if (err.response?.status === 404) {
      ElMessage.error('用户不存在')
    } else {
      ElMessage.error('获取用户信息失败')
    }
  }
})
</script>

<style scoped>
.user-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.user-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #5c6bc0;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-info h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.user-details {
  margin-bottom: 20px;
}

.user-details p {
  margin: 12px 0;
  color: #666;
  line-height: 1.6;
}

.user-details strong {
  color: #333;
  margin-right: 8px;
  min-width: 80px;
  display: inline-block;
}

.tags-section {
  margin: 16px 0;
}

.tags-container {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  margin: 4px;
  border-radius: 12px;
  padding: 4px 12px;
}

.no-tags {
  color: #999;
  font-style: italic;
}

.el-tag[type='success'] {
  background-color: #5c6bc0;
  border: none;
  color: white;
}

.el-tag[type='danger'] {
  background-color: #ef5350;
  border: none;
  color: white;
}
</style>


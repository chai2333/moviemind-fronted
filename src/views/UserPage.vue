<template>
  <div class="user-page" v-if="user">
    <div class="profile-info">
      <h2>{{ user.username }}</h2>
      <p>{{ user.introduce }}</p>
      <el-button 
        type="primary" 
        @click="handleFollow"
        :type="isFollowing ? 'default' : 'primary'"
      >
        {{ isFollowing ? '取消关注' : '关注' }}
      </el-button>
    </div>
    <HistoryPreview />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUser, toggleFollow } from '@/services/user'
import HistoryPreview from './HistoryDetail.vue'

const route = useRoute()
const user = ref(null)
const isFollowing = ref(false)

onMounted(async () => {
  try {
    const res = await getUser(route.params.id)
    user.value = res.data
    // 检查是否已关注
    isFollowing.value = res.data.is_following || false
  } catch (err) {
    console.error('获取用户信息失败', err)
  }
})

async function handleFollow() {
  try {
    await toggleFollow(route.params.id)
    isFollowing.value = !isFollowing.value
    ElMessage.success(isFollowing.value ? '关注成功' : '已取消关注')
  } catch (err) {
    console.error('操作失败', err)
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.user-page {
  padding: 20px;
}
.profile-info {
  margin-bottom: 20px;
}
</style>


<template>
  <div class="comment">
    <div class="comment-header">
      <div class="user-info">
        <span class="username">{{ comment.username }}</span>
        <el-button 
          v-if="comment.user_id !== currentUserId"
          size="small" 
          :type="comment.is_following ? 'info' : 'primary'"
          @click="handleFollow(comment.user_id)"
        >
          {{ comment.is_following ? '已关注' : '关注' }}
        </el-button>
      </div>
      <span class="time">{{ formatTime(comment.created_time) }}</span>
    </div>
    <div class="comment-content">{{ comment.content }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { toggleFollow } from '@/services/user'
import { ElMessage } from 'element-plus'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const auth = useAuthStore()
const currentUserId = computed(() => auth.user?.id)

async function handleFollow(userId) {
  try {
    const res = await toggleFollow(userId)
    props.comment.is_following = res.data.is_following
    ElMessage.success(res.data.is_following ? '关注成功' : '已取消关注')
  } catch (err) {
    console.error('关注操作失败:', err)
    ElMessage.error('操作失败')
  }
}

function formatTime(time) {
  return new Date(time).toLocaleString()
}
</script>

<style scoped>
.comment {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-weight: bold;
  color: #333;
}

.time {
  color: #999;
  font-size: 12px;
}

.comment-content {
  color: #666;
  line-height: 1.5;
}
</style> 
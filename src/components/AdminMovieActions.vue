<template>
  <div class="admin-actions">
    <el-button 
      v-if="isAdminPage"
      type="danger" 
      size="small" 
      @click="deleteMovie"
    >删除电影</el-button>
    <el-button 
      v-if="commentId"
      type="danger" 
      size="small" 
      @click="deleteComment"
    >删除评论</el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  movieId: {
    type: [String, Number],
    required: true
  },
  commentId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['comment-deleted'])
const route = useRoute()

const isAdminPage = computed(() => {
  return route.path.startsWith('/admin/')
})

async function deleteMovie() {
  try {
    await ElMessageBox.confirm('确定要删除这部电影吗？', '警告', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await api.delete(`/admin/movie/${props.movieId}`)
    ElMessage.success('电影已删除')
    window.location.href = '/admin/movies'
  } catch (err) {
    if (err !== 'cancel') {
      console.error('删除电影失败:', err)
      ElMessage.error('删除失败')
    }
  }
}

async function deleteComment() {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '警告', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await api.delete(`/admin/comment/${props.commentId}`)
    ElMessage.success('评论已删除')
    emit('comment-deleted', props.commentId)
  } catch (err) {
    if (err !== 'cancel') {
      console.error('删除评论失败:', err)
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style scoped>
.admin-actions {
  display: inline-flex;
  gap: 8px;
}
</style> 
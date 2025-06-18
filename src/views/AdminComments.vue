<template>
  <div class="admin-comments">
    <h2>评论审核</h2>
    <el-table v-if="comments.length" :data="comments" border style="width: 100%">
      <el-table-column prop="userName" label="用户" width="150" />
      <el-table-column prop="movieName" label="电影" width="200" />
      <el-table-column prop="content" label="评论内容" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" size="small" @click="approve(scope.row)">通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="暂无待审核评论" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { ElMessage } from 'element-plus'

const comments = ref([])

async function fetchComments() {
  try {
    const res = await api.get('/admin/comment')
    comments.value = res.data.results.map(item => ({
      id: item.comment_id,
      movieName: item.movie_name,
      userName: item.user_name,
      content: item.comment_content
    }))
  } catch (err) {
    console.error('获取评论列表失败', err)
    ElMessage.error('加载失败')
  }
}

async function approve(row) {
  try {
    await api.get(`/admin/comment/${row.id}/visible`)
    ElMessage.success('评论已通过')
    comments.value = comments.value.filter(c => c.id !== row.id)
  } catch (err) {
    console.error('审核失败', err)
    ElMessage.error('操作失败')
  }
}

onMounted(fetchComments)
</script>

<style scoped>
.admin-comments {
  padding: 20px;
}
</style>

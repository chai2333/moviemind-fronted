<template>
  <div class="admin-report">
    <h2>举报审核</h2>
    <el-table v-if="reports.length" :data="reports" border style="width: 100%">
      <el-table-column prop="reportedUser" label="被举报用户" width="150" />
      <el-table-column prop="reason" label="举报理由" width="200" />
      <el-table-column prop="content" label="被举报评论内容" />

      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="danger" size="small" @click="banUser(scope.row)">封禁</el-button>
          <el-button type="primary" size="small" @click="ignoreReport(scope.row)">忽略</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-else description="暂无举报信息" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const reports = ref([])

async function fetchReports() {
  try {
    const res = await api.get('/admin/comment')
    reports.value = res.data.results.map(item => ({
      id: item.comment_id,
      reportedUser: item.user_name,
      content: item.movie_name,
      userId: item.user_id
    }))
  } catch (err) {
    console.error('获取举报信息失败', err)
    if (err.response) {
      // 服务器返回了错误状态码
      console.error('错误状态码:', err.response.status)
      console.error('错误信息:', err.response.data)
      if (err.response.status === 403) {
        ElMessage.error('没有权限访问')
        router.push('/')
      } else if (err.response.status === 404) {
        ElMessage.error('API路径不存在，请检查后端服务')
      } else {
        ElMessage.error(err.response.data?.message || '加载失败')
      }
    } else if (err.request) {
      // 请求已发送但没有收到响应
      console.error('未收到响应:', err.request)
      ElMessage.error('服务器无响应，请检查后端服务是否运行')
    } else {
      // 请求配置出错
      console.error('请求错误:', err.message)
      ElMessage.error('请求配置错误')
    }
  }
}

function banUser(row) {
  ElMessageBox.confirm(`确定要封禁 ${row.reportedUser} 吗？`, '警告', {
    confirmButtonText: '封禁',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await api.delete(`/admin/user/${row.userId}`)
      ElMessage.success('用户已封禁')
      reports.value = reports.value.filter(r => r.id !== row.id)
    } catch (err) {
      console.error('封禁用户失败:', err)
      ElMessage.error('操作失败')
    }
  }).catch(() => {})
}

function ignoreReport(row) {
  ElMessageBox.confirm('确定忽略此举报？', '提示', {
    confirmButtonText: '忽略',
    cancelButtonText: '取消',
    type: 'info',
  }).then(async () => {
    try {
      await api.get(`/admin/comment/${row.id}/visible`)
      ElMessage.success('已忽略举报')
      reports.value = reports.value.filter(r => r.id !== row.id)
    } catch (err) {
      console.error('忽略举报失败:', err)
      ElMessage.error('操作失败')
    }
  }).catch(() => {})
}

onMounted(fetchReports)
</script>

<style scoped>
.admin-report {
  padding: 20px;
}
</style>

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
import { getReports, banUserById, ignoreReportById } from '@/services/AdminService'
import { ElMessage, ElMessageBox } from 'element-plus'

const reports = ref([])

async function fetchReports() {
  try {
    const res = await getReports()
    reports.value = res.data || []
  } catch (err) {
    console.error('获取举报信息失败', err)
    ElMessage.error('加载失败')
  }
}

function banUser(row) {
  ElMessageBox.confirm(`确定要封禁 ${row.reportedUser} 吗？`, '警告', {
    confirmButtonText: '封禁',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await banUserById(row.id)
    ElMessage.success('用户已封禁')
    reports.value = reports.value.filter(r => r.id !== row.id)
  }).catch(() => {})
}

function ignoreReport(row) {
  ElMessageBox.confirm('确定忽略此举报？', '提示', {
    confirmButtonText: '忽略',
    cancelButtonText: '取消',
    type: 'info',
  }).then(async () => {
    await ignoreReportById(row.id)
    ElMessage.success('已忽略举报')
    reports.value = reports.value.filter(r => r.id !== row.id)
  }).catch(() => {})
}

onMounted(fetchReports)
</script>

<style scoped>
.admin-report {
  padding: 20px;
}
</style>

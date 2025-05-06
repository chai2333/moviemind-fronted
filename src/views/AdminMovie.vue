<template>
  <div class="admin-movie">
    <h2>电影管理</h2>
    
    <el-table :data="movies" border style="width: 100%">
      <el-table-column prop="movie_id" label="ID" width="80" />
      <el-table-column prop="title" label="电影名称" />
      <el-table-column prop="directors" label="导演" />
      <el-table-column prop="year" label="年份" width="100" />
      <el-table-column prop="rating" label="评分" width="100" />
      
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editMovie(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteMovie(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="编辑电影信息">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="电影名称">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="导演">
          <el-input v-model="editForm.directors" />
        </el-form-item>
        <el-form-item label="年份">
          <el-input v-model="editForm.year" type="number" />
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="editForm.rating" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveMovie">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const movies = ref([])
const dialogVisible = ref(false)
const editForm = ref({
  movie_id: '',
  title: '',
  directors: '',
  year: '',
  rating: ''
})

async function fetchMovies() {
  try {
    const res = await api.get('/admin/movie')
    movies.value = res.data.results
  } catch (err) {
    console.error('获取电影列表失败:', err)
    ElMessage.error('加载失败')
  }
}

function editMovie(movie) {
  editForm.value = { ...movie }
  dialogVisible.value = true
}

async function saveMovie() {
  try {
    await api.patch('/admin/movie', editForm.value)
    ElMessage.success('更新成功')
    dialogVisible.value = false
    fetchMovies()
  } catch (err) {
    console.error('更新电影信息失败:', err)
    ElMessage.error('更新失败')
  }
}

function deleteMovie(movie) {
  ElMessageBox.confirm(`确定要删除电影"${movie.title}"吗？`, '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await api.delete(`/admin/movie/${movie.movie_id}`)
      ElMessage.success('删除成功')
      fetchMovies()
    } catch (err) {
      console.error('删除电影失败:', err)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

onMounted(fetchMovies)
</script>

<style scoped>
.admin-movie {
  padding: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 
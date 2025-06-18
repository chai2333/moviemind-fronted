<template>
  <div class="admin-movies">
    <h2>电影管理</h2>
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索电影..."
        @input="handleSearch"
        clearable
      />
    </div>

    <div class="movie-list">
      <div v-for="movie in movies" :key="movie.movie_id" class="movie-item">
        <div class="movie-poster">
          <img 
            :src="movie.large_images || movie.small_images || '/default-movie.png'" 
            :alt="movie.name"
            @error="handleImgError"
            referrerpolicy="no-referrer"
          />
        </div>
        <div class="movie-info">
          <h3>{{ movie.name }}</h3>
          <div class="movie-meta">
            <p><strong>导演：</strong>{{ movie.director }}</p>
            <p><strong>主演：</strong>{{ movie.actors?.replace(/[\[\]']/g, '') }}</p>
            <p><strong>类型：</strong>{{ movie.tags?.replace(/[\[\]']/g, '') }}</p>
            <p><strong>年份：</strong>{{ movie.pubdate }}</p>
            <p><strong>地区：</strong>{{ movie.countries?.replace(/[\[\]']/g, '') }}</p>
            <p><strong>语言：</strong>{{ movie.language?.replace(/[\[\]']/g, '') }}</p>
            <p><strong>时长：</strong>{{ movie.durations?.replace(/[\[\]']/g, '') }}</p>
          </div>
          <div class="movie-stats">
            <span>👀 {{ movie.like_count || 0 }}</span>
            <span>❤️ {{ movie.likes || 0 }}</span>
            <span>⭐ {{ movie.rating || 0 }}</span>
          </div>
          <div class="movie-summary">
            <p><strong>简介：</strong>{{ movie.summary }}</p>
          </div>
          <div class="movie-actions">
            <el-button type="primary" @click="editMovie(movie)">编辑</el-button>
            <el-button type="danger" @click="deleteMovie(movie.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="编辑电影"
      width="50%"
    >
      <el-form :model="editingMovie" label-width="100px">
        <el-form-item label="电影名称">
          <el-input v-model="editingMovie.name" />
        </el-form-item>
        <el-form-item label="导演">
          <el-input v-model="editingMovie.director" />
        </el-form-item>
        <el-form-item label="主演">
          <el-input v-model="editingMovie.actors" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="editingMovie.tags" />
        </el-form-item>
        <el-form-item label="年份">
          <el-input v-model="editingMovie.pubdate" />
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="editingMovie.countries" />
        </el-form-item>
        <el-form-item label="语言">
          <el-input v-model="editingMovie.language" />
        </el-form-item>
        <el-form-item label="时长">
          <el-input v-model="editingMovie.durations" />
        </el-form-item>
        <el-form-item label="评分">
          <el-input-number v-model="editingMovie.rating" :precision="1" :step="0.1" :min="0" :max="10" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="editingMovie.summary" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="海报">
          <el-input v-model="editingMovie.large_images" placeholder="大图URL" />
          <el-input v-model="editingMovie.small_images" placeholder="小图URL" class="mt-2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveMovie">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-pagination
      v-if="total > 0"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
      layout="prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/services/api'

const movies = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const dialogVisible = ref(false)
const editingMovie = ref({})

function handleImgError(e) {
  e.target.src = '/default-movie.png'
}

async function fetchMovies() {
  try {
    const res = await api.get('/movie/movie/', {
      params: {
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchQuery.value
      }
    })
    movies.value = res.data.results
    total.value = res.data.count
  } catch (err) {
    console.error('获取电影列表失败:', err)
    ElMessage.error('获取电影列表失败')
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchMovies()
}

function handlePageChange(page) {
  currentPage.value = page
  fetchMovies()
}

async function deleteMovie(movieId) {
  if (!movieId) {
    ElMessage.error('电影ID无效')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除这部电影吗？', '警告', {
      type: 'warning'
    })
    await api.delete(`/movie/movie/${movieId}/`)
    ElMessage.success('删除成功')
    fetchMovies()
  } catch (err) {
    if (err !== 'cancel') {
      console.error('删除电影失败:', err)
      ElMessage.error('删除失败')
    }
  }
}

function editMovie(movie) {
  const processedMovie = {
    ...movie,
    actors: movie.actors?.replace(/[\[\]']/g, '') || '',
    tags: movie.tags?.replace(/[\[\]']/g, '') || '',
    countries: movie.countries?.replace(/[\[\]']/g, '') || '',
    language: movie.language?.replace(/[\[\]']/g, '') || '',
    durations: movie.durations?.replace(/[\[\]']/g, '') || '',
    pubdate: movie.pubdate?.replace(/[\[\]']/g, '') || ''
  }
  editingMovie.value = processedMovie
  dialogVisible.value = true
}

async function saveMovie() {
  try {
    const movieData = {
      ...editingMovie.value,
      name: editingMovie.value.name || '',
      director: editingMovie.value.director || '',
      actors: editingMovie.value.actors ? `[${editingMovie.value.actors}]` : '[]',
      tags: editingMovie.value.tags ? `[${editingMovie.value.tags}]` : '[]',
      countries: editingMovie.value.countries ? `[${editingMovie.value.countries}]` : '[]',
      language: editingMovie.value.language ? `[${editingMovie.value.language}]` : '[]',
      durations: editingMovie.value.durations ? `[${editingMovie.value.durations}]` : '[]',
      pubdate: editingMovie.value.pubdate ? `[${editingMovie.value.pubdate}]` : '[]',
      summary: editingMovie.value.summary || '',
      large_images: editingMovie.value.large_images || '',
      small_images: editingMovie.value.small_images || '',
      rating: editingMovie.value.rating || 0,
      like_count: editingMovie.value.like_count || 0
    }

    delete movieData.id

    await api.put(`/movie/movie/${editingMovie.value.id}/`, movieData)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchMovies()
  } catch (err) {
    console.error('保存电影失败:', err)
    if (err.response?.data) {
      ElMessage.error(`保存失败: ${JSON.stringify(err.response.data)}`)
    } else {
      ElMessage.error('保存失败')
    }
  }
}

onMounted(fetchMovies)
</script>

<style scoped>
.admin-movies {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.movie-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.movie-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.movie-poster img {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.movie-info h3 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.movie-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.movie-meta p {
  margin: 0;
}

.movie-stats {
  display: flex;
  gap: 20px;
  font-size: 16px;
  color: #666;
}

.movie-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.movie-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.mt-2 {
  margin-top: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 
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
            <el-button type="danger" @click="deleteMovie(movie.movie_id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>

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
  // TODO: 实现编辑功能
  ElMessage.info('编辑功能开发中...')
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
</style> 
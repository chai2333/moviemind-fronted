<template>
  <div class="movie-list">
    <div class="header">
      <h2>我的收藏</h2>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索电影..."
          @input="handleSearch"
        />
      </div>
    </div>

    <div class="cards">
      <div v-for="movie in filteredMovies" :key="movie.id" class="movie-card">
        <img
          :src="movie.image || '/default-movie.png'"
          :alt="movie.name"
          @error="handleImgError"
          referrerpolicy="no-referrer"
        />
        <div class="info">
          <h3>{{ movie.name }}</h3>
          <p>{{ movie.director }} / {{ movie.year }}</p>
          <p class="rating">评分：{{ movie.rating }}</p>
        </div>
        <router-link :to="'/movie/' + movie.id" class="action-btn view">
          查看详情
        </router-link>
      </div>
    </div>

    <div class="pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)"
      >
        上一页
      </button>
      <span>第 {{ currentPage }} 页</span>
      <button 
        :disabled="!hasNextPage" 
        @click="changePage(currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const movies = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const hasNextPage = ref(false)
const pageSize = 10
const router = useRouter()

const filteredMovies = computed(() => {
  if (!searchQuery.value) return movies.value
  const query = searchQuery.value.toLowerCase()
  return movies.value.filter(movie => 
    movie.name.toLowerCase().includes(query) ||
    movie.director.toLowerCase().includes(query)
  )
})

const handleSearch = () => {
  currentPage.value = 1
  fetchMovies()
}

const changePage = (page) => {
  currentPage.value = page
  fetchMovies()
}

const fetchMovies = async () => {
  try {
    const offset = (currentPage.value - 1) * pageSize
    const res = await api.get('/interact/collect/', {
      params: { limit: pageSize, offset }
    })
    movies.value = res.data.results.map(m => ({
      id: m.movie_id,
      name: m.movie_name,
      director: m.movie_director,
      image: m.movie_image || m.large_images || m.small_images,
      rating: m.movie_rating || 0,
      year: m.movie_year
    }))
    hasNextPage.value = res.data.next !== null
  } catch (err) {
    console.error('获取收藏列表失败:', err)
  }
}

const handleImgError = (e) => {
  e.target.src = '/default-movie.png'
}

onMounted(fetchMovies)
</script>

<style scoped>
.movie-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #333;
}

.search-box input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.movie-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.movie-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.movie-card .info {
  padding: 12px;
  flex: 1;
}

.movie-card h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.movie-card p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.movie-card .rating {
  color: #ff9800;
}

.action-btn {
  display: block;
  text-align: center;
  padding: 8px 0;
  background-color: #5c6bc0;
  color: #fff;
  text-decoration: none;
  border-radius: 0 0 8px 8px;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background-color: #3f51b5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #5c6bc0;
  background: white;
  color: #5c6bc0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background: #5c6bc0;
  color: white;
}

.pagination button:disabled {
  border-color: #ddd;
  color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  color: #666;
}

</style>
  
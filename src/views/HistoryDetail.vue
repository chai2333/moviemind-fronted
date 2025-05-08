<template>
  <div class="history-preview">
    <h3>浏览历史</h3>
    <div class="movie-list">
      <div v-for="movie in history.viewed" :key="movie.id" class="movie-card">
        <router-link :to="'/movie/' + movie.id">
          <img 
            :src="movie.image || '/default-movie.png'" 
            :alt="movie.name"
            @error="handleImgError"
            referrerpolicy="no-referrer"
          />
          <div class="movie-title">{{ movie.name }}</div>
        </router-link>
      </div>
    </div>

    <h3>收藏电影</h3>
    <div class="movie-list">
      <div v-for="movie in history.favorites" :key="movie.id" class="movie-card">
        <router-link :to="'/movie/' + movie.id">
          <img 
            :src="movie.image || '/default-movie.png'" 
            :alt="movie.name"
            @error="handleImgError"
            referrerpolicy="no-referrer"
          />
          <div class="movie-title">{{ movie.name }}</div>
        </router-link>
      </div>
    </div>

    <h3>点赞电影</h3>
    <div class="movie-list">
      <div v-for="movie in history.liked" :key="movie.id" class="movie-card">
        <router-link :to="'/movie/' + movie.id">
          <img 
            :src="movie.image || '/default-movie.png'" 
            :alt="movie.name"
            @error="handleImgError"
            referrerpolicy="no-referrer"
          />
          <div class="movie-title">{{ movie.name }}</div>
        </router-link>
      </div>
    </div>

    <h3>历史评论</h3>
    <div class="movie-list">
      <div v-for="movie in history.commented" :key="movie.id" class="movie-card">
        <router-link :to="'/movie/' + movie.id">
          <img 
            :src="movie.image || '/default-movie.png'" 
            :alt="movie.name"
            @error="handleImgError"
            referrerpolicy="no-referrer"
          />
          <div class="movie-title">{{ movie.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import PreviewRow from '@/components/PreviewRow.vue'

const history = ref({
  viewed: [],
  favorites: [],
  liked: [],
  commented: []
})

onMounted(async () => {
  try {
    const [historyRes, favoritesRes, likedRes, commentedRes] = await Promise.all([
      api.get('/interact/history', { params: { limit: 5, offset: 0 } }),
      api.get('/interact/collect/', { params: { limit: 5, offset: 0 } }),
      api.get('/interact/like/', { params: { limit: 5, offset: 0 } }),
      api.get('/interact/comment', { 
        params: { 
          limit: 1000,  // 获取足够多的评论
          offset: 0,
          ordering: '-comment_updated_time'  // 按评论更新时间倒序
        }
      })
    ])

    // 获取所有评论的电影ID，去重并保留顺序
    const uniqueMovieIds = new Set()
    const uniqueMovies = []
    
    // 遍历评论，按时间倒序处理
    commentedRes.data.results.forEach(comment => {
      if (!uniqueMovieIds.has(comment.movie_id)) {
        uniqueMovieIds.add(comment.movie_id)
        uniqueMovies.push({
          id: comment.movie_id,
          name: comment.movie_name,
          director: comment.movie_director,
          image: comment.movie_image || comment.large_images || comment.small_images,
          rating: comment.movie_rating || 0,
          year: comment.movie_year
        })
      }
    })

    // 只取前5个
    const recentCommentedMovies = uniqueMovies.slice(0, 5)

    history.value = {
      viewed: (historyRes.data.results || []).map(m => ({
        id: m.movie_id,
        name: m.movie_name,
        director: m.movie_director,
        image: m.movie_image || m.large_images || m.small_images,
        rating: m.movie_rating || 0,
        year: m.movie_year
      })).reverse(),
      favorites: (favoritesRes.data.results || []).map(m => ({
        id: m.movie_id,
        name: m.movie_name,
        director: m.movie_director,
        image: m.movie_image || m.large_images || m.small_images,
        rating: m.movie_rating || 0,
        year: m.movie_year
      })).reverse(),
      liked: (likedRes.data.results || []).map(m => ({
        id: m.movie_id,
        name: m.movie_name,
        director: m.movie_director,
        image: m.movie_image || m.large_images || m.small_images,
        rating: m.movie_rating || 0,
        year: m.movie_year
      })).reverse(),
      commented: recentCommentedMovies
    }

    console.log('历史评论电影:', recentCommentedMovies)
  } catch (err) {
    console.error('获取历史记录失败:', err)
  }
})
</script>

<style scoped>
.history-preview {
  padding: 20px;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.movie-card {
  width: 160px;
}

.movie-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.movie-card img:hover {
  transform: scale(1.05);
}

.movie-title {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

h3 {
  font-size: 20px;
  color: #333;
  margin: 20px 0;
}
</style>

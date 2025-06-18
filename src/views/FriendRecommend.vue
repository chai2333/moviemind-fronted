<template>
  <div class="friend-recommend">
    <div class="header">
      <h2>友邻推荐</h2>
      <el-button class="refresh-btn" size="small" @click="fetchRecommend">刷新</el-button>
    </div>
    <div v-if="!movies.length" class="empty">暂无推荐内容</div>
    <div class="list-container">
      <div
        v-for="mov in movies"
        :key="mov.id"
        class="movie-item"
        @click="goDetail(mov.id)"
      >
        <img
          :src="mov.image"
          referrerpolicy="no-referrer"
          alt="电影海报"
          @error="e => e.target.src = no_poster"
        />
        <div class="info">
          <h3>{{ mov.name }}</h3>
          <p class="director">{{ mov.director }}</p>
          <p class="summary">{{ mov.summary }}</p>
        </div>
        <div class="meta">
          <div class="score">{{ mov.rating.toFixed(1).replace('.', ',') }} 分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import no_poster from '@/assets/no_poster.png'

const router = useRouter()
const movies = ref([])

function parseImages(field) {
  if (!field) return []
  try {
    const arr = JSON.parse(field)
    if (Array.isArray(arr)) return arr
  } catch {}
  return field.split(',').map(u => u.trim()).filter(u => u)
}

function goDetail(id) {
  router.push({ name: 'MovieDetail', params: { id } })
}

async function fetchRecommend() {
  try {
    const res = await api.get('/movie/myrecommend/')
    const list = res.data.results || res.data || []
    movies.value = list.map(m => {
      const imgs = parseImages(m.large_images || m.small_images || '')
      return {
        id: m.id,
        image: imgs[0] || no_poster,
        name: m.name,
        director: m.director || '',
        summary: m.summary || '',
        rating: m.rating || 0
      }
    })
  } catch (err) {
    console.error('获取友邻推荐失败:', err)
  }
}

onMounted(fetchRecommend)
</script>

<style scoped>
.friend-recommend { padding: 24px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.header h2 { margin: 0; }
.list-container { max-height: calc(100vh - 200px); overflow-y: auto; }
.movie-item { display: flex; padding: 12px; background: #fff; border-radius: 8px; margin-bottom: 12px; cursor: pointer; }
.movie-item img { width: 80px; height: 120px; object-fit: cover; border-radius: 4px; margin-right: 16px; }
.movie-item .info { flex: 1; }
.movie-item .director { color: #777; font-size: 14px; margin: 4px 0; }
.movie-item .summary { color: #555; font-size: 14px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.meta { width: 80px; text-align: right; }
.empty { text-align: center; color: #888; margin-top: 40px; }
.refresh-btn { margin-left: 8px; }
</style>

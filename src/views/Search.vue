<template>
  <div class="search-results">
    <h2>搜索结果如下</h2>

    <div v-if="!movies.length" class="no-results">
      暂无匹配 “{{ query }}” 的电影
    </div>

    <div
      v-for="mov in movies"
      :key="mov.id"
      class="search-item"
      @click="goDetail(mov.id)"
    >
      <img
        :src="mov.image"
        alt="电影海报"
        @error="e => e.target.src = '/default-poster.png'"
      />
      <div class="details">
        <h3>{{ mov.name }}</h3>
        <p class="date">{{ mov.pubdate || '未知年份' }}</p>
        <p class="summary">{{ mov.summary }}</p>
      </div>
      <div class="meta">
        <div class="score">{{ mov.rating.toFixed(1).replace('.', ',') }} 分</div>
      </div>
    </div>

    <!-- 调试用：打印当前 movies 数组 -->
    <pre style="background:#f5f5f5; padding:1em; margin:2em 0;">
{{ JSON.stringify(movies, null, 2) }}
    </pre>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

// 将 large_images/small_images 拆成数组
function parseImages(field) {
  if (!field) return []
  try {
    const arr = JSON.parse(field)
    if (Array.isArray(arr)) return arr
  } catch {
    // 不是 JSON，就按逗号拆
  }
  return field
    .split(',')
    .map(u => u.trim())
    .filter(u => u)
}

const route = useRoute()
const router = useRouter()
const movies = ref([])

// 取 ?q= 参数
const query = computed(() => route.query.q || '')

function goDetail(id) {
  router.push({ name: 'MovieDetail', params: { id } })
}

async function fetchSearch() {
  const q = query.value.trim()
  if (!q) {
    movies.value = []
    return
  }

  const res = await api.get('/movie/movie/', {
    params: { offset: 0, limit: 1000 }
  })
  const list = res.data.results || res.data || []

  // 简单按名字过滤
  const filtered = list.filter(m =>
    m.name?.toLowerCase().includes(q.toLowerCase())
  )

  // 映射字段并取第一张封面
  movies.value = filtered.map(m => {
    const imgs = parseImages(m.large_images || m.small_images || '')
    return {
      id: m.id,
      image: imgs[0] || '/default-poster.png',
      name: m.name,
      pubdate: m.pubdate,
      summary: m.summary,
      rating: m.rating ?? 0
    }
  })
}

onMounted(fetchSearch)
watch(query, fetchSearch)
</script>

<style scoped>
.search-results {
  padding: 24px;
  background: #fff;
}
.search-results h2 {
  font-size: 24px;
  margin-bottom: 16px;
}
.no-results {
  color: #999;
  text-align: center;
  margin-top: 40px;
}
.search-item {
  display: flex;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
}
.search-item img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
}
.details {
  flex: 1;
}
.details h3 {
  margin: 0;
  font-size: 18px;
}
.details .date {
  color: #999;
  font-size: 14px;
  margin: 4px 0;
}
.details .summary {
  color: #666;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.meta {
  width: 80px;
  text-align: right;
  font-size: 14px;
  color: #333;
}
.meta .score {
  font-size: 16px;
  font-weight: bold;
}
</style>

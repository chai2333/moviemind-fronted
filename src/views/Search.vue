<template>
    <div class="search-results">
      <h2>搜索结果如下</h2>
      <div v-for="mov in movies" :key="mov.id" class="search-item" @click="goDetail(mov.id)">
        <img :src="mov.image || mov.images?.[0]" alt="" />
        <div class="details">
          <h3>{{ mov.name }}</h3>
          <p class="date">{{ mov.pubdate || mov.release_date }}</p>
          <p>{{ mov.summary }}</p>
        </div>
        <div class="meta">
          <div class="score">{{ mov.rating }} 分</div>
          <!-- 这里可以用星星组件或者图标来表现评分 -->
        </div>
      </div>
    </div>

    
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/services/api'
  import { useRouter } from 'vue-router'
  
  const route = useRoute()
  const movies = ref([])
  const router = useRouter()

  function goDetail(id) {
  router.push({ name: 'MovieDetail', params: { id } })
}
  
  async function fetchSearch() {
    const q = route.query.q
    if (!q) return
    const res = await api.get('/movie/findByStatus', { params: { status: q } })
    movies.value = res.data  // 或者 res.data.results，根据后台接口
  }
  
  onMounted(fetchSearch)
  watch(() => route.query.q, fetchSearch)
  </script>
  
  <style scoped>
  
  </style>
  
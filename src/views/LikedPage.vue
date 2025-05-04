<template>
    <div class="movie-list">
      <h2>我点赞的影片</h2>
      <div class="list-container">
        <div
          v-for="(mov, idx) in movies"
          :key="mov.id"
          class="movie-item"
          @click="goDetail(mov.id)"
        >
          <div class="rank" :class="{ first: idx===0 }">{{ idx+1 }}</div>
          <img :src="mov.image" class="poster" />
          <div class="info">
            <h3>{{ mov.name }}</h3>
            <p class="director">{{ mov.director }} <span v-if="mov.year">({{ mov.year }})</span></p>
            <p class="summary">{{ mov.summary }}</p>
          </div>
          <div class="rating">
            <div class="score">{{ mov.rating.toFixed(1).replace('.',',') }}/10</div>
            <div class="stars">
              <i
                v-for="n in 5"
                :key="n"
                class="el-icon-star-on"
                :style="starStyle(n, mov.rating)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getUserLiked } from '@/services/UserService'
  
  const movies = ref([])
  const router = useRouter()
  
  function starStyle(n, rating) {
    const half = Math.ceil(rating / 2)
    if (n <= Math.floor(rating / 2)) return { color: '#FF9800' }
    if (n === half) return { color: '#FF980080' }
    return { color: '#ccc' }
  }
  
  function goDetail(id) {
    router.push({ name: 'MovieDetail', params: { id } })
  }
  
  onMounted(async () => {
    const res = await getUserLikes()
    movies.value = res?.data?.liked?.map(m => ({
      id: m.id,
      image: m.images?.[0] || m.photoUrls?.[0] || '',
      name: m.name,
      director: m.director || '',
      summary: m.summary || '',
      rating: m.rating || 0,
      year: m.pubdate ? new Date(m.pubdate).getFullYear() : null
    })) || []
  })
  </script>
  
  <style scoped>
  .movie-list { padding: 24px; }
  .movie-list h2 { text-align:center; font-size:32px; margin-bottom:24px; }
  .list-container { max-height:calc(100vh - 200px); overflow-y:auto; }
  .movie-item { display:flex; align-items:flex-start; margin-bottom:24px; }
  .rank { width:60px; font-size:48px; text-align:center; color:#000; }
  .rank.first { color:#FF9800; }
  .poster { width:120px; height:160px; object-fit:cover; border-radius:8px; margin:0 16px; }
  .info { flex:1; }
  .info h3 { margin:0; font-size:24px; }
  .info .director { margin:4px 0; color:#555; font-size:14px; }
  .info .summary {
    margin-top:8px; display:-webkit-box;
    -webkit-line-clamp:2; -webkit-box-orient:vertical;
    overflow:hidden; text-overflow:ellipsis;
  }
  .rating { width:140px; text-align:right; margin-left:16px; }
  .score { font-size:32px; }
  .stars { display:flex; justify-content:flex-end; }
  .stars i { font-size:20px; margin-left:4px; }
  </style>
  
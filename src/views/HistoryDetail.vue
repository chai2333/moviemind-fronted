<template>
  <div class="history-preview">
    <h3>浏览历史</h3>
    <PreviewRow :movies="history.viewed" moreLink="/history/viewed" />

    <h3>收藏电影</h3>
    <PreviewRow :movies="history.favorites" moreLink="/history/favorites" />

    <h3>点赞电影</h3>
    <PreviewRow :movies="history.liked" moreLink="/history/liked" />

    <h3>历史评论</h3>
    <PreviewRow :movies="history.commented" moreLink="/history/comments" />
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
      api.get('/interact/comment', { params: { limit: 5, offset: 0 } })
    ])

    history.value = {
      viewed: historyRes.data.results.map(m => ({
        id: m.movie_id,
        name: m.movie_name,
        director: m.movie_director,
        image: m.movie_image
      })),
      favorites: favoritesRes.data.results.map(m => ({
        id: m.movie_id,
        name: m.movie_name,
        director: m.movie_director,
        image: m.movie_image
      })),
      liked: likedRes.data.results.map(m => ({
        id: m.movie_id,
        name: m.movie_name,
        director: m.movie_director,
        image: m.movie_image
      })),
      commented: commentedRes.data.results.map(m => ({
        id: m.movie_id,
        name: m.movie_name,
        director: m.movie_director,
        image: m.movie_image
      }))
    }
  } catch (err) {
    console.error('获取历史记录失败:', err)
  }
})
</script>

<style scoped>
.history-preview {
  padding: 20px;
}
</style>

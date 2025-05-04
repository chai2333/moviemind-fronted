<template>
  <div class="history-preview">
    <h3>浏览历史</h3>
    <PreviewRow :movies="history.viewed" moreLink="/history/viewed" />

    <h3>收藏电影</h3>
    <PreviewRow :movies="history.favorites" moreLink="/history/favorites" />

    <h3>点赞电影</h3>
    <PreviewRow :movies="history.liked" moreLink="/history/liked" />

    <h3>历史评论</h3>
    <PreviewRow :movies="history.commented" moreLink="/history/commented" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserHistory } from '@/services/UserService' 
import PreviewRow from '@/components/PreviewRow.vue'

const history = ref({
  viewed: [],
  favorites: [],
  liked: [],
  commented: []
})

onMounted(async () => {
  const res = await getUserHistory()
  history.value = res.data || {}
})
</script>

<style scoped>
.history-preview {
  padding: 20px;
}
</style>

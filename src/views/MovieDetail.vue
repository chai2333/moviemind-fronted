<template>
    <div>
      <el-card class="mb-4">
        <h2>{{ movie.name || movie.title }}</h2>
        <p><strong>导演：</strong>{{ movie.director }}</p>
        <p><strong>演员：</strong>{{ movie.actor }}</p>
        <p>{{ movie.summary }}</p>
      </el-card>
      <el-card class="mb-4">
        <h3>发表评论</h3>
        <TinymceEditor v-model="newComment" :init="{ height: 200 }" />
        <el-button type="primary" class="mt-2" @click="submitComment">提交</el-button>
      </el-card>
      <el-card v-for="c in comments" :key="c.comment_id" class="mb-2">
        <p><strong>{{ c.user_name }}:</strong></p><div v-html="c.comment_content"></div>
      </el-card>
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/services/api'
  const route = useRoute()
  const movie = ref({})
  const comments = ref([])
  const newComment = ref('')
  async function fetchMovie() {
    const id = route.params.id
    const res = await api.get(`/movie/movie/${id}`)
    movie.value = res.data.data || res.data
    const list = await api.get('/movie/moviemcomment', { params: { movie_id: id } })
    comments.value = list.comment_list
  }
  async function submitComment() {
    const id = route.params.id
    await api.post('/interact/comment', { movie_id: id, content: newComment.value })
    newComment.value = ''
    fetchMovie()
  }
  onMounted(fetchMovie)
  </script>
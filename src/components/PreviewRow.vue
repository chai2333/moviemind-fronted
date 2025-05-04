<template>
    <div class="preview-row">
      <div class="movie-item" v-for="movie in movies" :key="movie.id" @click="$router.push(`/movie/${movie.id}`)">
        <img :src="movie.poster" alt="poster" />
        <p>{{ movie.name }}</p>
      </div>
      <router-link :to="moreLink">
        <el-button type="text">更多</el-button>
      </router-link>
    </div>
  </template>
  
  <script setup>
  defineProps({
    movies: { type: Array, default: () => [] },
    moreLink: { type: String, required: true }
  })
  </script>
  
  <style scoped>
  .preview-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .movie-item {
    width: 100px;
    margin: 10px;
    cursor: pointer;
  }
  .movie-item img {
    width: 100px;
    height: 150px;
    object-fit: cover;
  }
  </style>
  
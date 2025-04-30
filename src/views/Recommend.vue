<template>
    <div class="recommend">
      <div class="recommend-search">
        <input
          v-model="query"
          @keyup.enter="onRecommend"
          placeholder="你可以给我一个关键词或者说一段话"
        />
        <button @click="onRecommend">推荐</button>
      </div>
      <!-- 你可以在下面渲染推荐结果 -->
      <div v-if="result" class="recommend-result">
        {{ result.message }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import api from '@/services/api'
  
  const query = ref('')
  const result = ref(null)
  
  async function onRecommend() {
    if (!query.value) return
    const res = await api.get('/recommandation/list', { params: { uuid: '', limit: 10, offset: 0, message: query.value } })
    result.value = res.data  // 根据接口返回调整
  }
  </script>
  
  <style scoped>
  .recommend-search {
    display: flex;
    max-width: 600px;
    margin: 100px auto;
  }
  .recommend-search input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 24px 0 0 24px;
  }
  .recommend-search button {
    padding: 12px 24px;
    border: none;
    background: #5c6bc0;
    color: #fff;
    border-radius: 0 24px 24px 0;
    cursor: pointer;
  }
  </style>
  
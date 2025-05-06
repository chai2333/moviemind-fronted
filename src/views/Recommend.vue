<template>
  <div class="recommend">
    <div class="recommend-search">
      <input
        v-model="query"
        @keyup.enter="onRecommend"
        placeholder="你可以给我一个关键词或者说一段话"
      />
      <button @click="onRecommend">发送对话</button>
    </div>

    <!-- 聊天气泡显示区域 -->
    <div class="chat-area">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message-bubble', msg.role === 'user' ? 'user-bubble' : 'robot-bubble']"
        v-html="msg.message"
      ></div>
    </div>
    <div v-if="isLoading" class="message-bubble robot-bubble loading-bubble">
      正在生成回复...
    </div>
  </div>
</template>

  
<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const query = ref('')
const result = ref(null)
const messages = ref([]);
const isLoading = ref(false) 

function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 100)
}

const onRecommend = async () => {
  if (!query.value.trim()) return;

  const userMessage = query.value.trim();

  //用户消息气泡
  messages.value.push({ role: 'user', message: userMessage });

  //请求参数
  const requestData = {
    uuid: '',
    limit: 10,
    offset: 0,
    message: userMessage
  };
  isLoading.value = true  

  //清空输入框
  query.value = '';

  try {
    const res = await api.post('http://localhost:3001/api/v1/workspace/movie/chat', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer C4R5W41-98VMF5E-NXAWA7T-796DK61'
      },
      timeout: 300000,
      withCredentials: false
    });

    //处理返回文本
    let originalText = res.data.textResponse;

    originalText = originalText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    originalText = originalText.replace(/\*{4}([^*]+)\*{4}/g, '<strong>$1</strong>');
    originalText = originalText.replace(/\*{2}([^*]+)\*{2}/g, '<strong>$1</strong>');

    messages.value.push({ role: 'robot', message: originalText });

    previousAnswers.value.push(res.data.textResponse);

  } catch (error) {
    console.error('获取回复失败:', error);
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};


</script>
  
<style scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-bubble {
  margin-bottom: 16px; 
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  word-break: break-word;
}

.user-bubble {
  background-color: #7ccce2;
  align-self: flex-end;
  margin-left: auto;
}

.robot-bubble {
  background-color: #c0b8e8;
  align-self: flex-start;
  margin-right: auto;
}

.recommend-search {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0); 
  display: flex;
  max-width: 600px;
  margin: 10 auto;
  padding-top: 30px;
  padding-bottom: 12px;
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
.loading-bubble {
  font-style: italic;
  color: #888;
}
</style>

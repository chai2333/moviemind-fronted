<template>
  <div class="movie-detail">
    <div class="header">
      <h2>{{ movie?.name || '未命名电影' }}</h2>
      <button v-if="isAdmin" @click="deleteMovie" style="margin-left: 20px; color: red;">
        ✖️ 删除电影
      </button>
      <div class="stats">
        👀 {{ movie?.browse ?? 0 }}
        ❤️ {{ movie?.likes ?? 0 }}
        ⭐ {{ movie?.stars ?? 0 }}
      </div>
    </div>

    <div class="poster-and-tags">
      <img
        :src="movie?.poster"
        alt="电影海报"
        @error="handleImgError"
        class="poster"
      />
      <div class="tags">
        <span v-for="tag in movie?.tags || []" :key="tag" class="tag">{{ tag }}</span>
        <el-popover trigger="hover" placement="right">
          <template #reference>
            <span class="more-info">更多信息</span>
          </template>
          <div>
            <p>导演：{{ movie?.director || '未知' }}</p>
            <p>主演：{{ movie?.actors?.join(', ') || '暂无信息' }}</p>
          </div>
        </el-popover>
      </div>
    </div>

    <div class="rating">
      评分：{{ movie?.rating ?? '暂无' }}/10
    </div>

    <div class="ai-comment">
      <h3>AI影评</h3>
      <p>{{ movie?.aiComment || '暂无影评' }}</p>
    </div>

    <div class="actions" v-if="!isAdmin">
      <button @click="toggle('watched')">{{ movie?.watched ? '✅ 已看过' : '👀 看过' }}</button>
      <button @click="toggle('liked')">{{ movie?.liked ? '❤️ 已点赞' : '💗 点赞' }}</button>
      <button @click="toggle('collected')">{{ movie?.collected ? '⭐ 已收藏' : '☆ 收藏' }}</button>

      <div v-if="movie?.watched">
        评分：
        <span
          v-for="i in 5"
          :key="i"
          @click="setUserScore(i)"
          class="user-star"
        >
          {{ i <= movie?.userScore ? '★' : '☆' }}
        </span>
      </div>
    </div>

    <div class="comment-section">
      <h3>评论区</h3>
      <div v-for="comment in movie?.comments || []" :key="comment.id" class="comment">
        <img :src="comment.avatar" alt="头像" class="avatar" />
        <div class="comment-body">
          <strong>{{ comment.username }}</strong> - 打分：{{ comment.rating }}
          <p>{{ comment.content }}</p>
          <div class="meta">
            {{ comment.time }}　
            👍 {{ comment.likes }}　
            👎 {{ comment.dislikes }}　
            回复
            <button v-if="isAdmin" @click="deleteComment(comment.id)" style="margin-left: 10px; color: red;">🗑 删除</button>
          </div>
        </div>

        <div class="replies" v-if="comment.replies?.length">
          <div
            v-for="reply in comment.replies"
            :key="reply.id"
            class="reply"
          >
            <img :src="reply.avatar" class="avatar" />
            <div class="comment-body">
              <strong>{{ reply.username }}</strong> - 打分：{{ reply.rating }}
              <p>{{ reply.content }}</p>
              <div class="meta">
                {{ reply.time }}　
                👍 {{ reply.likes }}　
                👎 {{ reply.dislikes }}　
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="movie?.watched && !isAdmin" class="add-comment">
        <h4>我要评论</h4>
        <textarea v-model="newComment" placeholder="写下你的想法..."></textarea>
        <button @click="submitComment">发布评论</button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getMovieDetail } from '@/services/MovieDetail.js';
import { useAuthStore } from '@/store/auth'



const auth = useAuthStore()
const isAdmin = computed(() => auth.user?.role === 'admin')

const movie = ref({});
const newComment = ref('');

const handleImgError = (e) => {
  e.target.src = 'https://via.placeholder.com/200x300';
};

onMounted(async () => {
  const res = await getMovieDetail(1);
  movie.value = res;
});

function toggle(field) {
  if (movie.value && field in movie.value) {
    movie.value[field] = !movie.value[field];
  }
}

function setUserScore(score) {
  movie.value.userScore = score;
}

function submitComment() {
  if (newComment.value.trim()) {
    movie.value.comments.push({
      id: Date.now(),
      username: '当前用户',
      avatar: 'https://via.placeholder.com/50',
      rating: movie.value.userScore,
      content: newComment.value,
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      likes: 0,
      dislikes: 0,
      replies: []
    });
    newComment.value = '';
  }
}

async function deleteMovie() {
  await deleteMovieById(movie.value.id)
  ElMessage.success('电影已删除')
  window.location.href = '/movies'
}

async function deleteComment(commentId) {
  movie.value.comments = movie.value.comments.filter(c => c.id !== commentId)
  ElMessage.success('评论已删除')
}

</script>

<style scoped>
.movie-detail {
  padding: 20px 40px;
  max-width: 1000px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stats {
  font-size: 14px;
  color: #888;
}
.poster-and-tags {
  display: flex;
  margin-top: 20px;
}
.poster {
  width: 200px;
  height: 300px;
  background-color: #eee;
  object-fit: cover;
}
.tags {
  margin-left: 20px;
}
.tag {
  display: inline-block;
  background-color: #5c6bc0;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  margin: 4px;
}
.more-info {
  color: blue;
  cursor: pointer;
}
.rating {
  font-size: 18px;
  margin-top: 10px;
}
.ai-comment h3 {
  font-size: 18px;
  color: #5c6bc0;
  margin-bottom: 10px;
}
.actions button {
  background-color: #5c6bc0;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 8px 20px;
  margin-right: 10px;
  cursor: pointer;
}
.user-star {
  font-size: 22px;
  cursor: pointer;
  color: #5c6bc0;
}
.comment {
  display: flex;
  margin-bottom: 15px;
}
.avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.comment-body {
  background: #fafafa;
  padding: 10px;
  border-radius: 5px;
  flex: 1;
}
.meta {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
.replies {
  margin-left: 60px;
  margin-top: 10px;
}
.reply {
  display: flex;
  margin-bottom: 10px;
}
.comment-section h3,
.add-comment h4 {
  font-size: 18px;
  color: #5c6bc0;
  margin-bottom: 10px;
}
.add-comment textarea {
  width: 100%;
  height: 80px;
  margin-top: 10px;
}
.add-comment button {
  background-color: #5c6bc0;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
}

</style>

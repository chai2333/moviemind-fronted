<template>
  <div class="movie-detail">
    <div class="header">
      <h2>{{ movie?.title || '未命名电影' }}</h2>
      <AdminMovieActions 
        :movie-id="movie?.movie_id"
        @comment-deleted="handleCommentDeleted"
      />
      <div class="stats">
        👀 {{ movie?.browse ?? 0 }}
        ❤️ {{ movie?.likes ?? 0 }}
        ⭐ {{ movie?.rating ?? 0 }}
      </div>
    </div>

    <div class="poster-and-tags">
      <img
        :src="movie?.images"
        alt="电影海报"
        @error="handleImgError"
        class="poster"
      />
      <div class="tags">
        <span v-for="tag in (movie?.tags || '').split(',')" :key="tag" class="tag">{{ tag }}</span>
        <el-popover trigger="hover" placement="right">
          <template #reference>
            <span class="more-info">更多信息</span>
          </template>
          <div>
            <p>导演：{{ movie?.directors || '未知' }}</p>
            <p>主演：{{ movie?.actor || '暂无信息' }}</p>
            <p>类型：{{ movie?.genres || '未知' }}</p>
            <p>年份：{{ movie?.year || '未知' }}</p>
            <p>地区：{{ movie?.countries || '未知' }}</p>
            <p>语言：{{ movie?.languages || '未知' }}</p>
            <p>时长：{{ movie?.durations || '未知' }}</p>
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
      <button 
        @click="toggle('watched')" 
        :class="{ active: movie?.watched }"
      >{{ movie?.watched ? '✅ 已看过' : '👀 看过' }}</button>
      <button 
        @click="toggle('liked')" 
        :class="{ active: movie?.is_like }"
      >{{ movie?.is_like ? '❤️ 已点赞' : '💗 点赞' }}</button>
      <button 
        @click="toggle('collected')" 
        :class="{ active: movie?.is_collect }"
      >{{ movie?.is_collect ? '⭐ 已收藏' : '☆ 收藏' }}</button>

      <div v-if="movie?.watched" class="user-rating">
        评分：
        <span
          v-for="i in 5"
          :key="i"
          @click="setUserScore(i * 2)"
          class="user-star"
          :class="{ active: i * 2 <= movie?.is_rate }"
        >
          {{ i * 2 <= movie?.is_rate ? '★' : '☆' }}
        </span>
      </div>
    </div>

    <div class="comment-section">
      <h3>评论区</h3>
      <div v-for="comment in movie?.comments || []" :key="comment.comment_id" class="comment">
        <img :src="comment.user_avatar || '/default-avatar.png'" alt="头像" class="avatar" />
        <div class="comment-body">
          <strong>{{ comment.username }}</strong> 
          <span v-if="comment.rating">- 打分：{{ comment.rating }}</span>
          <p>{{ comment.content }}</p>
          <div class="meta">
            {{ comment.create_time }}　
            <button class="action-btn" @click="toggleCommentLike(comment)">
              👍 {{ comment.likes || 0 }}
            </button>
            <button class="action-btn" @click="toggleCommentDislike(comment)">
              👎 {{ comment.dislikes || 0 }}
            </button>
            <button class="action-btn" @click="showReplyInput(comment)">回复</button>
            <AdminMovieActions 
              v-if="isAdmin"
              :movie-id="movie?.movie_id"
              :comment-id="comment.comment_id"
              @comment-deleted="handleCommentDeleted"
            />
          </div>
        </div>

        <div v-if="comment.replies?.length" class="replies">
          <div
            v-for="reply in comment.replies"
            :key="reply.reply_id"
            class="reply"
          >
            <img :src="reply.user_avatar || '/default-avatar.png'" class="avatar" />
            <div class="comment-body">
              <strong>{{ reply.username }}</strong>
              <p>{{ reply.content }}</p>
              <div class="meta">
                {{ reply.create_time }}　
                <button class="action-btn" @click="toggleReplyLike(reply)">
                  👍 {{ reply.likes || 0 }}
                </button>
                <button class="action-btn" @click="toggleReplyDislike(reply)">
                  👎 {{ reply.dislikes || 0 }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeReplyId === comment.comment_id" class="reply-input">
          <textarea v-model="replyContent" placeholder="写下你的回复..."></textarea>
          <div class="reply-actions">
            <button @click="submitReply(comment)">发布回复</button>
            <button @click="cancelReply">取消</button>
          </div>
        </div>
      </div>

      <div v-if="movie?.watched && !isAdmin" class="add-comment">
        <h4>我要评论</h4>
        <div class="comment-rating">
          评分：
          <span
            v-for="i in 5"
            :key="i"
            @click="setNewCommentRating(i * 2)"
            class="user-star"
            :class="{ active: i * 2 <= newCommentRating }"
          >
            {{ i * 2 <= newCommentRating ? '★' : '☆' }}
          </span>
        </div>
        <textarea v-model="newComment" placeholder="写下你的想法..."></textarea>
        <button @click="submitComment">发布评论</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import AdminMovieActions from '@/components/AdminMovieActions.vue'

const auth = useAuthStore()
const isAdmin = computed(() => auth.user?.role === 'admin')
const route = useRoute()

const movie = ref({})
const newComment = ref('')
const newCommentRating = ref(0)
const activeReplyId = ref(null)
const replyContent = ref('')

const handleImgError = (e) => {
  e.target.src = 'https://via.placeholder.com/200x300'
}

onMounted(async () => {
  try {
    const [movieRes, actionRes] = await Promise.all([
      api.get(`/movie/movie/${route.params.id}/`),
      api.get('/movie/movieaction', { params: { movie_id: route.params.id } })
    ])
    
    movie.value = {
      ...movieRes.data,
      ...actionRes.data,
      movie_id: route.params.id
    }

    // 获取评论列表
    const commentRes = await api.get('/interact/comment', {
      params: { movie_id: route.params.id }
    })
    
    // 处理评论数据
    movie.value.comments = commentRes.data.results.map(comment => ({
      comment_id: comment.comment_id,
      content: comment.comment_content,
      username: auth.user?.username || '未知用户',
      user_avatar: auth.user?.avatar || '/default-avatar.png',
      rating: 0, // 后端暂时没有返回评分
      create_time: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      replies: []
    }))
  } catch (err) {
    console.error('获取电影详情失败:', err)
    ElMessage.error('加载失败')
  }
})

async function toggle(field) {
  try {
    switch(field) {
      case 'liked':
        if (movie.value.is_like && movie.value.like_id) {
          await api.delete(`/interact/like/${movie.value.like_id}/`)
          movie.value.is_like = false
        } else {
          const res = await api.post('/interact/like/', { movie_id: movie.value.movie_id })
          movie.value.like_id = res.data.like_id
          movie.value.is_like = true
        }
        break
      case 'collected':
        if (movie.value.is_collect && movie.value.collect_id) {
          await api.delete(`/interact/collect/${movie.value.collect_id}/`)
          movie.value.is_collect = false
        } else {
          const res = await api.post('/interact/collect/', { movie_id: movie.value.movie_id })
          movie.value.collect_id = res.data.collect_id
          movie.value.is_collect = true
        }
        break
      case 'watched':
        if (!movie.value.watched) {
          await api.post('/interact/history/', { movie_id: movie.value.movie_id })
          movie.value.watched = true
        }
        break
    }
    ElMessage.success('操作成功')
  } catch (err) {
    console.error('操作失败:', err)
    ElMessage.error('操作失败')
  }
}

async function setUserScore(score) {
  try {
    if (movie.value.is_rate && movie.value.rate_id) {
      await api.patch(`/interact/rate/${movie.value.rate_id}/`, { rate: score })
    } else {
      const res = await api.post('/interact/rate/', { 
        movie_id: movie.value.movie_id,
        rate: score
      })
      movie.value.rate_id = res.data.rate_id
    }
    movie.value.is_rate = score
    ElMessage.success('评分成功')
  } catch (err) {
    console.error('评分失败:', err)
    ElMessage.error('评分失败')
  }
}

async function submitComment() {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  try {
    const res = await api.post('/interact/comment/', {
      movie_id: movie.value.movie_id,
      content: newComment.value,
      rating: newCommentRating.value
    })
    
    // 重新获取评论列表
    const commentRes = await api.get('/interact/comment', {
      params: { movie_id: movie.value.movie_id }
    })
    
    // 处理评论数据
    movie.value.comments = commentRes.data.results.map(comment => ({
      comment_id: comment.comment_id,
      content: comment.comment_content,
      username: auth.user?.username || '未知用户',
      user_avatar: auth.user?.avatar || '/default-avatar.png',
      rating: newCommentRating.value,
      create_time: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      replies: []
    }))
    
    newComment.value = ''
    newCommentRating.value = 0
    ElMessage.success('评论成功')
  } catch (err) {
    console.error('评论失败:', err)
    ElMessage.error('评论失败')
  }
}

function setNewCommentRating(score) {
  newCommentRating.value = score
}

function showReplyInput(comment) {
  activeReplyId.value = comment.comment_id
  replyContent.value = ''
}

function cancelReply() {
  activeReplyId.value = null
  replyContent.value = ''
}

async function submitReply(comment) {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  try {
    await api.post('/interact/comment/reply/', {
      comment_id: comment.comment_id,
      content: replyContent.value
    })

    // 重新获取评论列表
    const res = await api.get('/interact/comment', {
      params: { movie_id: movie.value.movie_id }
    })
    movie.value.comments = res.data.results

    activeReplyId.value = null
    replyContent.value = ''
    ElMessage.success('回复成功')
  } catch (err) {
    console.error('回复失败:', err)
    ElMessage.error('回复失败')
  }
}

async function toggleCommentLike(comment) {
  try {
    if (comment.is_like) {
      await api.delete(`/interact/comment/like/${comment.like_id}/`)
      comment.likes--
      comment.is_like = false
    } else {
      const res = await api.post('/interact/comment/like/', { comment_id: comment.comment_id })
      comment.likes++
      comment.is_like = true
      comment.like_id = res.data.like_id
    }
  } catch (err) {
    console.error('操作失败:', err)
    ElMessage.error('操作失败')
  }
}

async function toggleCommentDislike(comment) {
  try {
    if (comment.is_dislike) {
      await api.delete(`/interact/comment/dislike/${comment.dislike_id}/`)
      comment.dislikes--
      comment.is_dislike = false
    } else {
      const res = await api.post('/interact/comment/dislike/', { comment_id: comment.comment_id })
      comment.dislikes++
      comment.is_dislike = true
      comment.dislike_id = res.data.dislike_id
    }
  } catch (err) {
    console.error('操作失败:', err)
    ElMessage.error('操作失败')
  }
}

async function toggleReplyLike(reply) {
  try {
    if (reply.is_like) {
      await api.delete(`/interact/reply/like/${reply.like_id}/`)
      reply.likes--
      reply.is_like = false
    } else {
      const res = await api.post('/interact/reply/like/', { reply_id: reply.reply_id })
      reply.likes++
      reply.is_like = true
      reply.like_id = res.data.like_id
    }
  } catch (err) {
    console.error('操作失败:', err)
    ElMessage.error('操作失败')
  }
}

async function toggleReplyDislike(reply) {
  try {
    if (reply.is_dislike) {
      await api.delete(`/interact/reply/dislike/${reply.dislike_id}/`)
      reply.dislikes--
      reply.is_dislike = false
    } else {
      const res = await api.post('/interact/reply/dislike/', { reply_id: reply.reply_id })
      reply.dislikes++
      reply.is_dislike = true
      reply.dislike_id = res.data.dislike_id
    }
  } catch (err) {
    console.error('操作失败:', err)
    ElMessage.error('操作失败')
  }
}

function handleCommentDeleted(commentId) {
  movie.value.comments = movie.value.comments.filter(c => c.comment_id !== commentId)
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
.actions {
  margin: 20px 0;
}
.actions button {
  background-color: #5c6bc0;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 8px 20px;
  margin-right: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.actions button.active {
  background-color: #3f51b5;
  transform: scale(1.05);
}
.user-rating {
  margin-top: 10px;
}
.user-star {
  font-size: 22px;
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s ease;
}
.user-star.active {
  color: #FF9800;
}
.comment {
  display: flex;
  margin-bottom: 15px;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  background-color: #f0f0f0;
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
.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 2px 8px;
  margin: 0 4px;
}
.action-btn:hover {
  color: #5c6bc0;
}
.delete-btn {
  color: #ff4444;
  margin-left: 10px;
}
.replies {
  margin-left: 60px;
  margin-top: 10px;
}
.reply {
  display: flex;
  margin-bottom: 10px;
}
.reply-input {
  margin-left: 60px;
  margin-top: 10px;
}
.reply-input textarea {
  width: 100%;
  height: 60px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.reply-actions {
  display: flex;
  gap: 10px;
}
.reply-actions button {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.reply-actions button:first-child {
  background-color: #5c6bc0;
  color: white;
  border: none;
}
.reply-actions button:last-child {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
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
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.add-comment button {
  background-color: #5c6bc0;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
}
.comment-rating {
  margin-bottom: 10px;
}
</style>

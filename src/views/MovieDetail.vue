<template>
  <div class="movie-detail">
    <div
      class="hero"
      v-if="movie"
      :style="{ backgroundImage: `url(${movie.images || '/default-movie.png'})` }"
    >
      <div class="hero-overlay">
        <h2>{{ movie.title || '未命名电影' }}</h2>
        <div class="stats">
          👀 {{ movie.browse ?? 0 }}
          ❤️ {{ movie.likes ?? 0 }}
          ⭐ {{ movie.rating ?? 0 }}
        </div>
      </div>
    </div>
    <div class="header">
      <AdminMovieActions
        :movie-id="movie?.movie_id"
        @comment-deleted="handleCommentDeleted"
      />
    </div>

    <div class="poster-and-tags">
      <img
        :src="movie?.images || '/default-movie.png'"
        alt="电影海报"
        @error="handleImgError"
        class="poster"
        referrerpolicy="no-referrer"
      />
      <div class="tags">
        <span v-for="tag in (movie?.tags || '').split(',')" :key="tag" class="tag">{{ tag }}</span>
        <el-popover trigger="hover" placement="right" :width="300">
          <template #reference>
            <span class="more-info">更多信息</span>
          </template>
          <div class="more-info-content">
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
      <div class="score">{{ movie?.rating?.toFixed(1) ?? '暂无' }}/10</div>
      <div class="stars">
        <i
          v-for="n in 5"
          :key="n"
          class="el-icon-star-on"
          :style="starStyle(n, movie?.rating)"
        />
      </div>
    </div>

    <div class="summary">
      <p>{{ movie?.summary || '暂无简介' }}</p>
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

    </div>

    <div class="comment-section">
      <h3>评论区</h3>
      <div v-if="movie?.comments?.length > 0">
        <div v-for="comment in movie.comments" :key="comment.comment_id" class="comment">
          <div class="comment-body">
            <strong>{{ comment.username }}</strong> 
            <p>{{ comment.comment_content }}</p>
            <div class="meta" v-if="comment.comment_updated_time">
              {{ new Date(comment.comment_updated_time).toLocaleString() }}
            </div>
          </div>
        </div>

        <div class="pagination" v-if="totalComments > pageSize">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalComments"
            @current-change="handlePageChange"
            layout="prev, pager, next"
          />
        </div>
      </div>
      <div v-else class="no-comments">
        暂无评论
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

const movie = ref(null)
const newComment = ref('')
const newCommentRating = ref(0)
const activeReplyId = ref(null)
const replyContent = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const totalComments = ref(0)

function starStyle(n, rating) {
  const half = Math.ceil((rating || 0) / 2)
  if (n <= Math.floor((rating || 0) / 2)) return { color: '#FF9800' }
  if (n === half) return { color: '#FF980080' }
  return { color: '#ccc' }
}

const handleImgError = (e) => {
  e.target.src = '/default-movie.png'
}
async function fetchComments(forceReload = false) {
  try {
    // 获取所有评论
    const commentRes = await api.get('/interact/comment', { 
      params: {
        ordering: '-comment_updated_time',
        limit: 1000,  // 使用一个较大的值确保获取所有评论
        _: forceReload ? Date.now() : undefined
      }
    })
    
    // 获取当前电影ID
    const currentMovieId = parseInt(route.params.id)
    
    console.log('获取到的所有评论:', commentRes.data.results)
    console.log('当前电影ID:', currentMovieId)
    
    // 筛选当前电影的评论
    const filteredComments = commentRes.data.results.filter(
      comment => comment.movie_id === currentMovieId
    )
    
    console.log('筛选后的评论:', filteredComments)
    
    // 计算分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    // 更新评论数据
    movie.value.comments = filteredComments
      .slice(start, end)
      .map(comment => ({
        comment_id: comment.comment_id,
        comment_content: comment.comment_content,
        movie_id: comment.movie_id,
        username: comment.username || '未知用户',
        comment_updated_time: comment.comment_updated_time,
        rating: comment.rating || 0
      }))
    
    // 更新总数（使用筛选后的评论数量）
    totalComments.value = filteredComments.length

    console.log('分页参数:', {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      start,
      end
    })
    console.log('最终显示的评论:', movie.value.comments)
    console.log('评论总数:', totalComments.value)
  } catch (err) {
    console.error('获取评论失败:', err)
    ElMessage.error('加载评论失败')
  }
}

function handlePageChange(page) {
  currentPage.value = page
  fetchComments() // 重新分页
}

onMounted(async () => {
  try {
    const [movieRes, actionRes] = await Promise.all([
      api.get(`/movie/movie/${route.params.id}/`),
      api.get('/movie/movieaction', { params: { movie_id: route.params.id } })
    ])
    
    // 处理电影详情数据
    const movieData = movieRes.data
    const currentMovieId = parseInt(route.params.id)
    
    movie.value = {
      movie_id: currentMovieId,
      title: movieData.name,
      images: movieData.large_images || movieData.small_images,
      tags: movieData.tags?.replace(/[\[\]']/g, '').split(',').join(','),
      directors: movieData.director,
      actor: movieData.actors?.replace(/[\[\]']/g, ''),
      genres: movieData.tags?.replace(/[\[\]']/g, ''),
      year: movieData.pubdate,
      countries: movieData.countries?.replace(/[\[\]']/g, ''),
      languages: movieData.language?.replace(/[\[\]']/g, ''),
      durations: movieData.durations?.replace(/[\[\]']/g, ''),
      summary: movieData.summary,
      rating: movieData.rating,
      browse: movieData.like_count,
      aiComment: movieData.ai_comment,
      // 合并用户操作数据
      ...actionRes.data,
      comments: []
    }
    
    // 获取第一页评论
    await fetchComments()
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
    // 先提交评分
    if (newCommentRating.value > 0) {
      await api.post('/interact/rate/', {
        movie_id: parseInt(route.params.id),
        rate: newCommentRating.value
      })
    }
    
    // 再提交评论
    const commentRes = await api.post('/interact/comment/', {
      movie_id: parseInt(route.params.id),
      content: newComment.value,
      rating: newCommentRating.value
    })
    
    console.log('评论提交成功，返回数据:', commentRes.data)
    
    // 清空表单
    newComment.value = ''
    newCommentRating.value = 0
    ElMessage.success('评论成功')
    
    // 重新获取第一页评论
    currentPage.value = 1
    await fetchComments(true)  // 强制刷新评论列表
  } catch (err) {
    console.error('提交失败:', err.response?.data || err)
    ElMessage.error(`提交失败: ${err.response?.data?.detail || '未知错误'}`)
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
.hero {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: #fff;
}
.hero-overlay h2 {
  font-size: 32px;
  margin: 0;
}
.hero-overlay .stats {
  margin-top: 8px;
  font-size: 14px;
  color: #fff;
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
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 16px;
  margin: 8px;
  transition: all 0.3s ease;
}
.tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.more-info {
  display: inline-block;
  color: #5c6bc0;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 16px;
  margin: 8px;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}
.more-info:hover {
  background-color: #e0e0e0;
}
.more-info-content {
  line-height: 1.8;
}
.more-info-content p {
  margin: 8px 0;
}
.rating {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.rating .score {
  font-size: 22px;
  color: #333;
}
.rating .stars i {
  font-size: 20px;
}
.summary {
  margin-top: 20px;
  line-height: 1.6;
  color: #555;
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
  margin-bottom: 20px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
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
  flex: 1;
}
.comment-body strong {
  font-size: 16px;
  color: #333;
}
.comment-body p {
  margin: 8px 0;
  line-height: 1.6;
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
.pagination {
  margin: 20px 0;
  text-align: center;
}
.no-comments {
  text-align: center;
  color: #999;
  padding: 20px;
  font-size: 14px;
}
</style>

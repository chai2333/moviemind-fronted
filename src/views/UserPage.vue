<template>
  <div class="user-page" v-if="user">
    <div class="profile-info">
      <h2>{{ user.username }}</h2>
      <p>{{ user.introduce }}</p>
      <el-button type="primary" @click="toggleFollow">
        {{ followed ? '已关注' : '关注' }}
      </el-button>
    </div>
    <HistoryPreview />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUser, followUser, unfollow } from '@/services/user'
import HistoryPreview from './HistoryDetail.vue'

const route = useRoute()
const user = ref(null)
const followed = ref(false)
const followId = ref(null)

onMounted(async () => {
  try {
    const res = await getUser(route.params.id)
    user.value = res.data
  } catch (err) {
    console.error('获取用户信息失败', err)
  }
})

async function toggleFollow() {
  try {
    if (followed.value) {
      await unfollow(followId.value)
      followed.value = false
    } else {
      const res = await followUser(route.params.id)
      followId.value = res.data.id
      followed.value = true
    }
    ElMessage.success('操作成功')
  } catch (err) {
    console.error('操作失败', err)
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.user-page {
  padding: 20px;
}
.profile-info {
  margin-bottom: 20px;
}
</style>


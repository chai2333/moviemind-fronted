<template>
  <div class="user-page" v-if="user">
    <div class="profile-info">
      <h2>{{ user.username }}</h2>
      <p><strong>邮箱：</strong>{{ user.email }}</p>
      <p><strong>性别：</strong>{{ user.gender }}</p>
      <p><strong>电话：</strong>{{ user.phone_number }}</p>
      <p><strong>年龄：</strong>{{ user.age }}</p>
      <p><strong>简介：</strong>{{ user.introduce }}</p>
      <p v-if="user.tag?.length">
        <strong>标签：</strong>
        <el-tag v-for="t in user.tag" :key="t" class="tag">{{ t }}</el-tag>
      </p>
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
import { getUser, followUser, unfollow, getFollowings } from '@/services/user'
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

  try {
    const followRes = await getFollowings()
    const existing = (followRes.data.results || []).find(f => f.followed_id == route.params.id)
    if (existing) {
      followed.value = true
      followId.value = existing.id
    }
  } catch (err) {
    console.error('获取关注列表失败', err)
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
.tag {
  margin-right: 4px;
}
</style>


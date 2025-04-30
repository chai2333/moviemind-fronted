<template>
    <el-form :model="form" label-width="100px">
      <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
      <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
      <el-form-item label="性别"><el-input v-model="form.gender" /></el-form-item>
      <el-form-item label="电话"><el-input v-model="form.phone_number" /></el-form-item>
      <el-form-item label="年龄"><el-input type="number" v-model="form.age" /></el-form-item>
      <el-form-item label="简介"><el-input type="textarea" v-model="form.introduce" /></el-form-item>
      <el-button type="primary" @click="onUpdate">更新</el-button>
    </el-form>
  </template>
  <script setup>
  import { reactive, onMounted } from 'vue'
  import { getProfile, updateProfile } from '@/services/user'
  const form = reactive({ username: '', email: '', gender: '', phone_number: '', age: null, introduce: '' })
  async function fetchData() { const res = await getProfile(); Object.assign(form, res.data) }
  async function onUpdate() { await updateProfile(form) }
  onMounted(fetchData)
  </script>
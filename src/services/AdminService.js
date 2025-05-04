export async function getReports() {
  return {
    data: [
      {
        id: 1,
        reportedUser: '网络警察',
        reason: '辱骂他人',
        content: 'fxxk u!',
      },
      {
        id: 2,
        reportedUser: '大宝',
        reason: '广告推广',
        content: '给三国杀打好评谢谢喵',
      },
    ],
  }
}

export async function banUserById(id) {
  console.log(`[Mock] 封禁用户 id: ${id}`)
  return { success: true }
}

export async function ignoreReportById(id) {
  console.log(`[Mock] 忽略举报 id: ${id}`)
  return { success: true }
}

export function getUserProfile() {
  return Promise.resolve({
    id: 1,
    username: 'test_user',
    email: 'test@example.com',
    gender: '男',
    phone_number: '123456789',
    age: 25,
    introduce: '我爱电影！',
    tags: ['动作', '冒险'],
    avoidTags: ['恐怖']
  });
}

export function updateUserProfile(profile) {
  console.log('更新用户资料：', profile);
  return Promise.resolve({ success: true });
}

export async function getUserFavorites() {
  const res = await getUserHistory();
  return res.data.favorites || [];
}

export async function getUserLiked() {
  const res = await getUserHistory();
  return res.data.liked || [];
}

export async function getUserCommented() {
  const res = await getUserHistory();
  return res.data.commented || [];
}

export async function getUserHistory() {
  return {
    data: {
      viewed: [
        {
          id: 1,
          name: '电影A',
          poster: 'https://image.com/100x150',
          director: '导演A',
          year: 2020,
          rating: 7.5
        },
        {
          id: 2,
          name: '电影B',
          poster: 'https://image.com/100x150',
          director: '导演B',
          year: 2021,
          rating: 8.1
        }
      ],
      favorites: [
        {
          id: 3,
          name: '电影C',
          poster: 'https://image.com/100x150',
          director: '导演C',
          year: 2019,
          rating: 9.0
        }
      ],
      liked: [
        {
          id: 4,
          name: '电影D',
          poster: 'https://image.com/100x150',
          director: '导演D',
          year: 2022,
          rating: 8.3
        }
      ],
      commented: [
        {
          id: 5,
          name: '电影E',
          poster: 'https://image.com/100x150',
          director: '导演E',
          year: 2018,
          rating: 7.0,
          comment: '剧情紧凑，角色鲜明，值得一看！'
        },
        {
          id: 6,
          name: '电影F',
          poster: 'https://image.com/100x150',
          director: '导演F',
          year: 2023,
          rating: 6.5,
          comment: '节奏有些拖沓，但结尾不错。'
        }
      ]
    }
  };
}

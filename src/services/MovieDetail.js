export function getMovieDetail(id) {
  return Promise.resolve({
    id: id,
    name: '电影1',
    browse: 1000,
    likes: 100,
    stars: 50,
    poster: 'https://image.com/200x300', // 固定图像占位
    tags: ['剧情', '科幻', '动作'],
    rating: 8.2,
    aiComment: '这是一部紧张刺激、情节紧凑的优秀电影。',
    director: '导演名',
    actors: ['演员A', '演员B', '演员C'],
    watched: false,
    liked: false,
    collected: false,
    userScore: 0,
    comments: [
      {
        id: 1,
        username: '用户1',
        avatar: 'https://image.com/50',
        rating: 4,
        content: '非常好看，值得一看！',
        time: '2025-05-01 10:00',
        likes: 100,
        dislikes: 10,
        replies: [
          {
            id: 11,
            username: '用户2',
            avatar: 'https://image.com/50',
            rating: 3,
            content: '确实不错。',
            time: '2025-05-01 11:00',
            likes: 20,
            dislikes: 2
          }
        ]
      }
    ]
  });
}
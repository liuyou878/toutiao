// 新闻请求相关模块
import request from '@/utils/request'
// 请求新闻推荐 get
export const getNewsRecommended = (channel_id, timestamp) => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params: { channel_id, timestamp: timestamp || +new Date() }
  })
}

// 对文章不感兴趣 post
export const getIndifferent = (id) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/dislikes',
    data: { target: id }
  })
}

// 举报该文章 post
export const getReportArticle = (target, type, remark) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/reports',
    data: { target: target, type: type, remark: remark }
  })
}

// 新闻详情 /v1_0/articles/:article_id  GET
export const getNewsDetail = (article_id) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${article_id}`
  })
}

// 关注作者  /v1_0/user/followings POST
export const getAttentionAuthor = (article_id) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: { target: article_id }
  })
}

// 取消关注作者  /v1_0/user/followings/:target  DELETE
export const getCancelAuthor = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}

// 对文章点赞 Path： /v1_0/comment/likings POST
export const thumbUpArticlesAPI = (id) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: { target: id }
  })
}

// 取消点赞
// Path： /v1_0/comment/likings/:target  Method： DELETE
export const cancelThumbUpArticlesAPI = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${id}`,
    data: { target: id }
  })
}

// 获取评论
// Path： /v1_0/comments Method： GET
export const commentsAPI = (type, source, offset = null) => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params: { type, source, offset }
  })
}

// 对评论或评论回复点赞
// /v1_0/comment / likings Method： POST
export const isLikecommentsAPI = (target) => {
  return request({
    method: 'post',
    url: 'v1_0/comment/likings',
    data: { target: target }
  })
}

// 取消评论点选
// Path： /v1_0/comment/likings/:target  Method： DELETE
export const cancelLikecommentsAPI = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

// 发布评论
// Path： /v1_0/comments Method： POST
export const postContentAPI = (id, content, art_id = null) => {
  const data = { target: id, content: content }
  if (art_id !== null) {
    data.art_id = art_id
  }
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: data
  })
}

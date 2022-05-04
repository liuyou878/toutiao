// 用户请求相关模块
import request from '@/utils/request'
import { getToken } from '@/utils/token'

// 登录请求
export const login = (data) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'post',
    data
  })
}
// 获取用户频道
export const getUserChannel = () => {
  return request({
    url: '/v1_0/user/channels',
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken('token')}`
    }
  })
}

// 获取所有频道
export const getAllChannel = () => {
  return request({
    url: '/v1_0/channels',
    method: 'get'
  })
}

// 添加用户频道 PUT
export const getAddChannel = (channels) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: { channels }
  })
}

// 用户搜索联想  /v1_0/suggestion GET
export const getUserSearch = ({ q }) => {
  return request({
    url: '/v1_0/suggestion',
    method: 'get',
    params: { q: q }
  })
}

// 用户结果   /v1_0/search GET
export const getUserSearchResult = ({ page = 1, per_page = 10, q }) => {
  return request({
    url: '/v1_0/search',
    method: 'get',
    params: { page, per_page, q }
  })
}

// 获取用户自己个人信息
// Path： /v1_0/user Method： GET
export const getUserInfoAPI = () => {
  return request({
    url: '/v1_0/user',
    method: 'GET'
  })
}

// 获取用户的个人资料 v1_0/user/profile
export const getUserProfileAPI = () => {
  return request({
    url: 'v1_0/user/profile',
    method: 'GET'
  })
}

// 编辑用户的图片
// Path： /v1_0/user/photo  Method： PATCH
export const editUserPhotoAPI = (photo) => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: photo
  })
}

// 编辑用户的个人资料
// Path： /v1_0/user/profile Method： PATCH
export const editUserInfoAPI = (obj) => {
  const newObj = {
    name: null,
    gender: null,
    birthday: null,
    intro: null
  }
  for (const k in newObj) {
    if (obj[k] === undefined) {
      delete newObj[k]
    } else {
      newObj[k] = obj[k]
    }
  }
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: newObj
  })
}

// 获取无感知token
// Path： /v1_0/authorizations Method： PUT
export const getTokenAPI = () => {
  return request({
    url: '/v1_0/authorizations',
    method: 'put',
    headers: {
      Authorization: `Bearer ${getToken('refresh_token')}`
    }
  })
}

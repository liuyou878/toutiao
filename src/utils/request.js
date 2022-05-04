import axios from 'axios'
import router from '@/router'
// import { Notify } from 'vant'
// import { getTokenAPI } from '@/api/user'
import { getToken, removeToken } from '@/utils/token' // saveToken
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/', // 基础路径
  timeout: 5000
})

// Add a request interceptor
request.interceptors.request.use(function (config) {
  store.state.isLoading = true
  // Do something before request is sent
  // console.log(config)
  const token = getToken('token')
  if (token?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Do something with response data
  store.state.isLoading = false
  return response
}, async function (error) {
  store.state.isLoading = false
  if (error.response.status === 401) { // 身份过期
    // token续签方式一，去登录页重新登录，token无用，清掉-确保路由守卫if进不去
    removeToken('token')
    // router.replace('/login')
    console.log(router.currentRoute.fullPath)
    router.push(`/login?path=${router.currentRoute.fullPath}`)
  }
  //   console.dir(error)
  //   const data = await getTokenAPI()
  //   // Notify({ type: 'warning', message: '身份过期' })
  //   error.config.headers.Authorization = `Bearer ${data.data.data.token}`
  //   saveToken(data.data.data.token)
  //   console.dir(error)
  //   return request(error.config)
  // } else {
  //   if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
  //     removeToken('token')
  //     Notify({ type: 'warning', message: '身份过期' })
  //     console.log(router.currentRoute.fullPath)
  //     router.push(`/login?path=${router.currentRoute.fullPath}`)
  //   }
  // }
  console.dir(error)
  return Promise.reject(error)
})

export default request

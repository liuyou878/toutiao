import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'

Vue.use(VueRouter)

// 路由表
const routes = [
  { path: '/', redirect: '/layout/home' },
  // 登录页面  一级路由
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    beforeEnter: (_to, _from, next) => {
      if (getToken('token')?.length > 0) {
        return next(false)
      } else {
        next()
      }
    }
  },
  // layout
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { isRecord: true, top: 0 } // isRecord是否需要设置滚动位置
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/User/index.vue')
      }
    ]
  },
  // search
  {
    path: '/search', name: 'search', component: () => import('@/views/Search')
  },
  {
    path: '/search/:keywords', name: 'searchkeywords', component: () => import('@/views/Search/SearchResult')
  },
  // ArticleDetail
  {
    path: '/detail', name: 'detail', component: () => import('@/views/ArticleDetail')
  },
  {
    path: '/user_editor', name: 'user_editor', component: () => import('@/views/User/UserEdit')
  },
  {
    path: '/chat', name: 'chat', component: () => import('@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})
// 路由前置守卫
// router.beforeEach((to, from, next) => {
//   if (getToken('token')?.length > 0 && to.path === '/login') {
//     next(false)
//   } else {
//     next()
//   }
// })
// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})
export default router

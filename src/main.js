import Vue from 'vue'
// 引入路由
import router from '@/router/index'
import App from './App.vue'
import store from './store'
// 引入全局样式
import './style/index.less'
// 引入vant组件库
import Vant from 'vant'
// 引入rem适配
import 'amfe-flexible'
// 引入vant全部样式
import 'vant/lib/index.less'
// 引入文字高亮效果包
import 'highlight.js/styles/default.css' // 代码高亮的样式
import axios from 'axios'
axios.get('/api/nc/article/headline/T1348647853363/0-40.html').then((data) => {
  console.log(data)
})

const directives = {
  install () {
    Vue.directive('fofo', {
      inserted (el) {
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          setTimeout(() => {
            const input = document.querySelector('input')
            const textarea = document.querySelector('textarea')
            if (input) {
              // input.style.background = 'red'
              input.focus()
            } else {
              textarea.focus()
            }
          })
        }
      },
      update (el) {
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          setTimeout(() => {
            const input = document.querySelector('input')
            const textarea = document.querySelector('textarea')
            if (input) {
              console.log(input)
              input.focus()
            } else {
              textarea.focus()
            }
          })
        }
      }
    })
  }
}
Vue.use(directives)
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import store from './store'
// 引入全局样式
import './style/index.less'
// 引入vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

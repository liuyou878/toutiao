import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    photo: localStorage.getItem('photo'),
    isLoading: false
  },
  mutations: {
    GETPHOTO (state, value) {
      // console.log(value)
      state.photo = value
      localStorage.setItem('photo', value)
    },
    changeisLoading (state, data) {
      state.isLoading = data
    }
  },
  actions: {
  },
  modules: {
  }
})

<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <Article
        v-for="item in SearchResultList"
        :key="item.art_id"
        :newsRecommended="item"
        :isShow="false"
        @click.native="clickPush(item.art_id)"
      ></Article>
    </van-list>
  </div>
</template>

<script>
import { getUserSearchResult } from '@/api/user'
import Article from '@/components/Home/Article'
export default {
  name: 'SearchResult',
  components: {
    Article
  },
  data() {
    return {
      // 页码值
      page: 1,
      // 一页10条数据
      per_page: 10,
      // 搜索结果列表
      SearchResultList: [],
      loading: false, // 加载状态
      finished: false // 加载是否完成
    }
  },
  created() {
    // 用户搜索结果
    this.UserSearchResult()
  },
  methods: {
    // 用户搜索结果
    UserSearchResult() {
      // 从url中获取关键字
      const q = this.$route.params.keywords
      // 结构出页码值，页码条数
      const { page, per_page } = this
      // 发请求得到结果数据，有3个参数，页码，页码条数，还是关键字
      getUserSearchResult({ page, per_page, q }).then(({ data }) => {
        // 旧列表和请求回来的新列表合并
        this.SearchResultList = [...this.SearchResultList, ...data.data.results]
        // 得到当前页码数据后，关闭加载状态
        this.loading = false
        // 如果得到的请求新列表为空，则表示数据加载完毕，是最后一页了
        if (data.data.results.length === 0) {
          this.finished = true
        }
      })
    },
    // 上拉加载
    onLoad() {
      // 如果搜索结果列表为空，则不加载
      if (this.SearchResultList.length === 0) return
      // 上拉加页码加1
      this.page++
      // 得到数据
      this.UserSearchResult()
    },
    clickPush(id) {
      this.$router.push(`/detail?id=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px * 2;
}
</style>

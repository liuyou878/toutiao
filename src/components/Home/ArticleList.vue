<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="50"
      >
        <Article
          @click.native="clickPush(newsRecommended.art_id)"
          @emitReportArticle="emitReportArticle"
          @emitArtId="emitArtId"
          :newsRecommended="newsRecommended"
          v-for="newsRecommended in newsRecommendedList"
          :key="newsRecommended.art_id"
        ></Article>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Article from './Article'
import { getNewsRecommended, getIndifferent, getReportArticle } from '@/api/news'
export default {
  name: 'ArticleList',
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  components: {
    Article
  },
  data() {
    return {
      // 文章新闻列表
      newsRecommendedList: [],
      loading: false, // 加载中状态
      finished: false, // 加载完成状态
      pre_timestamp: null,
      isLoading: false
    }
  },
  created() {
    // 一打开网页获取新闻推荐
    // this.switchTab()
  },
  methods: {
    // 切换tab栏重新获取每页新闻数据
    async switchTab() {
      // 请求新闻数据
      const { data } = await getNewsRecommended(this.active, this.pre_timestamp)
      // 把请求回来的新数据合并成新的新闻列表
      this.newsRecommendedList = [...this.newsRecommendedList, ...data.data.results]
      // 如果获取的新闻列表为空则不在加载，表示到了底部了没有数据了
      this.pre_timestamp = data.data.pre_timestamp
      // 再关闭loading
      this.loading = false
      if (data.data.pre_timestamp === null) {
        this.finished = true
        return true
      }
    },
    // 底部加载方法
    onLoad() {
      // 上拉再获取新闻推荐
      this.switchTab()
    },
    // 下拉刷新
    onRefresh() {
      this.pre_timestamp = null
      this.newsRecommendedList = []
      this.switchTab()
      this.isLoading = false
      // setTimeout(() => {
      //   this.toast('刷新成功')
      //   this.isLoading = false
      // }, 1000)
    },
    // 不喜欢该文章方法
    async emitArtId(id) {
      await getIndifferent(id).then(() => {
        this.$notify({ type: 'success', message: '已成功' })
      })
    },
    // 举报该文章方法
    async emitReportArticle({ target, type, remark }) {
      await getReportArticle(target, type, remark)
      this.$notify({ type: 'success', message: '举报成功' })
    },
    clickPush(id) {
      this.$router.push(`/detail?id=${id}`)
    }
  }
}
</script>

<style></style>

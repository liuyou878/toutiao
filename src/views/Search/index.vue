<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        @search="searchFn"
        @input="changeInput"
        v-model.trim="kw"
        v-fofo
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list">
      <div
        class="sugg-item"
        @click="clickFn(item)"
        v-for="(item, i) in searchList"
        :key="i"
        v-html="lighFn(item || [], kw)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-if="!kw">
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="history = []" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          @click="historyPush(item)"
          class="history-item"
          v-for="(item, i) in history"
          :key="i"
          >{{ item }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getUserSearch } from '@/api/user'
export default {
  name: 'Search',
  data() {
    return {
      kw: '', // 搜索关键字
      // 控制定时器
      timer: null,
      // 搜索回来的数据列表
      searchList: [],
      history: JSON.parse(localStorage.getItem('history')) || []
    }
  },
  methods: {
    // input输入框变化请求联想数据
    changeInput(t) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.kw.length === 0) {
          this.searchList = []
          return
        }
        getUserSearch({ q: this.kw }).then(({ data }) => {
          this.searchList = data.data.options
        })
      }, 300)
    },
    // 联想高亮正则匹配
    lighFn(str, target) {
      const reg = new RegExp(target, 'ig')
      return str.replace(reg, (match) => {
        return `<span style="color:red;">${match}</span>`
      })
    },
    // 回车跳转路由
    searchFn() {
      if (this.kw.length === 0) return
      this.history.unshift(this.kw)
      this.history = Array.from(new Set(this.history))
      setTimeout(() => {
        this.$router.push(`/search/${this.kw}`)
      })
      // localStorage.setItem('history',this.kw)
    },
    // 历史记录跳转
    historyPush(item) {
      this.$router.push(`/search/${item}`)
    },
    // 建议列表跳转
    clickFn(item) {
      this.$router.push(`/search/${item}`)
    }
  },
  watch: {
    history: {
      handler(newVal) {
        localStorage.setItem('history', JSON.stringify(newVal))
      }
    },
    deep: true
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px * 2;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px * 2;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px * 2;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px * 2;
    line-height: 50px * 2;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px * 2;
  line-height: inherit;
}

.history-list {
  padding: 0 10px * 2;
  .history-item {
    display: inline-block;
    font-size: 12px * 2;
    padding: 8px 14px * 2;
    background-color: #efefef;
    margin: 10px 8px 0px 8px * 2;
    border-radius: 10px * 2;
  }
}
</style>

<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container" v-if="NewsDetailList.content">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ NewsDetailList.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="NewsDetailList.aut_name" :label="timeAgo(NewsDetailList.pubdate)">
        <template #icon>
          <img :src="NewsDetailList.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="NewsDetailList.is_followed"
              @click="isFocus(true)"
              >已关注</van-button
            >
            <van-button v-else icon="plus" type="info" size="mini" plain @click="isFocus(false)"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="NewsDetailList.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="NewsDetailList.attitude === 1"
          @click="isThumbUpArticles(1)"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="isThumbUpArticles(0)"
          >点赞</van-button
        >
      </div>
    </div>
    <div :class="{ 'art-cmt-container-1': show, 'art-cmt-container-2': !show }">
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <CommentList :Comments="item" v-for="item in CommentsList" :key="item.com_id"></CommentList>
      </van-list>
    </div>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="show">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="showCom">发表评论</div>
      <div class="icon-box">
        <van-badge :content="com_count === 0 ? '' : com_count" max="99">
          <van-icon name="comment-o" size="0.53333334rem" @click="rollTop" />
        </van-badge>
        <van-icon name="star-o" size="0.53333334rem" />
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea
        placeholder="友善评论、理性发言、阳光心灵"
        v-model.trim="content"
        @blur="showContent"
        v-fofo
      ></textarea>
      <van-button type="default" :disabled="content.length === 0" @click="postContent"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  getNewsDetail,
  getAttentionAuthor,
  getCancelAuthor,
  thumbUpArticlesAPI,
  cancelThumbUpArticlesAPI,
  commentsAPI,
  postContentAPI
} from '@/api/news'
import { timeAgo } from '@/utils/dayjs'
import CommentList from './CommentList'
export default {
  name: 'ArticleDetail',
  components: {
    CommentList
  },
  data() {
    return {
      // 新闻详情列表
      NewsDetailList: [],
      CommentsList: [],
      show: true,
      com_count: '',
      content: '',
      loading: false,
      finished: false,
      lastId: null
    }
  },
  created() {
    // 创建实例后立即请求数据保存在本地数组里
    this.getNewsDetailList()
    this.getCommentsList()
  },
  methods: {
    // 请求数据保存在本地数组里
    getNewsDetailList() {
      // 获取url中的query参数id
      const id = this.$route.query.id
      // 发送请求
      getNewsDetail(id).then(({ data }) => {
        this.NewsDetailList = data.data
      })
    },

    // 格式化时间，显示之前的日期离现在有多久
    timeAgo: timeAgo,

    // 触发是否关注作者
    isFocus(bool) {
      if (bool) {
        // 如果点击bool为true时,代表已关注，所有需要把is_followed改为false
        this.NewsDetailList.is_followed = false
        // 并传id发请求给服务器，取消关注作者
        getCancelAuthor(this.NewsDetailList.aut_id)
      } else {
        // 如果点击bool为false时,代表未关注，所有需要把is_followed改为true
        this.NewsDetailList.is_followed = true
        // 并传id发请求给服务器，保存关注作者
        getAttentionAuthor(this.NewsDetailList.aut_id)
      }
    },

    // 触发是否点赞作者
    isThumbUpArticles(one) {
      if (one === 1) {
        this.NewsDetailList.attitude = 0
        cancelThumbUpArticlesAPI(this.NewsDetailList.art_id)
      } else {
        this.NewsDetailList.attitude = 1
        thumbUpArticlesAPI(this.NewsDetailList.art_id)
      }
    },
    // 获取评论信息数据
    getCommentsList() {
      commentsAPI('a', this.$route.query.id, this.lastId).then((data) => {
        this.CommentsList = [...this.CommentsList, ...data.data.data.results]
        this.com_count = data.data.data.total_count
        this.lastId = data.data.data.last_id
        this.loading = false
        if (data.data.data.results.length === 0) {
          this.finished = true
        }
      })
    },
    // 控制发表评论显示
    showCom() {
      this.show = false
    },
    // 触发评论滑动到顶部
    rollTop() {
      const aa = document.querySelector('.like-box')
      aa.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    },
    // 失焦时导步关闭评论
    showContent() {
      setTimeout(() => {
        this.show = true
        this.content = ''
      }, 0)
    },
    // 发布评论
    postContent() {
      postContentAPI(this.NewsDetailList.art_id, this.content).then((data) => {
        // console.log(data)
        this.CommentsList.unshift(data.data.data.new_obj)
        this.com_count++
        this.rollTop()
      })
    },
    // 上拉加载
    onLoad() {
      this.getCommentsList()
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px * 2;
  margin-top: 46px * 2;
}
.art-title {
  font-size: 16px * 2;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px * 2;
  line-height: 24px * 2;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px * 2;
  height: 60px * 2;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px * 2;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px * 2;
}
.art-cmt-container-2 {
  padding-bottom: 80px * 2;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px * 2;
  line-height: 46px * 2;
  padding-left: 10px * 2;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px * 2;
    height: 30px * 2;
    font-size: 12px * 2;
    line-height: 30px * 2;
    padding-left: 15px * 2;
    margin-left: 10px * 2;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px * 2;
  height: 20px * 2;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px * 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px * 2;
  padding-left: 10px * 2;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px * 2;
    padding: 5px * 2;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>

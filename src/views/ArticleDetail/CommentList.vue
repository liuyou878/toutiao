<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="Comments.aut_photo" alt="" class="avatar" />
            <span class="uname">{{ Comments.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon
              name="like"
              size="16"
              color="red"
              v-if="Comments.is_liking"
              @click="isLike(true)"
            />
            <van-icon name="like-o" size="16" color="gray" v-else @click="isLike(false)" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body" v-html="Comments.content"></div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ timeAgo(Comments.pubdate) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { isLikecommentsAPI, cancelLikecommentsAPI } from '@/api/news'
import { timeAgo } from '@/utils/dayjs'
export default {
  props: {
    Comments: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      timeAgo: timeAgo
    }
  },
  methods: {
    isLike(bool) {
      if (bool) {
        cancelLikecommentsAPI(this.Comments.com_id).then(() => {
          this.Comments.is_liking = false
        })
      } else {
        isLikecommentsAPI(this.Comments.com_id).then(() => {
          this.Comments.is_liking = true
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
</style>

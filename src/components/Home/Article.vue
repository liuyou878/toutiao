<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ newsRecommended.title }}</span>
          <img
            v-if="newsRecommended.cover.type === 1"
            class="thumb"
            :src="newsRecommended.cover.images[0]"
          />
        </div>
        <div class="thumb-box" v-if="newsRecommended.cover.type > 1">
          <img
            class="thumb"
            v-for="(item, i) in newsRecommended.cover.images"
            :key="i"
            :src="item"
            alt=""
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ newsRecommended.aut_name }}</span>
            <span>{{ newsRecommended.comm_count }}</span>
            <span>{{ formData(newsRecommended.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="showCross" v-if="isShow" />
          <van-action-sheet
            @open="onclose"
            v-model="show"
            :actions="actions"
            @select="onSelect"
            get-container="body"
            :cancel-text="calcelText"
            @cancel="onCancel"
          />
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/dayjs'
import { firstActions, secondActions } from '@/api/report'
export default {
  name: 'Article',
  props: {
    newsRecommended: {
      type: Object,
      default: () => {}
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      actions: [{ name: '不感兴趣' }, { name: '反馈垃圾内容' }],
      calcelText: '取消'
    }
  },
  methods: {
    // 过去发表时间与现在的时间差
    formData: timeAgo,
    // 显示反馈组件
    showCross() {
      this.show = true
    },
    // 选择反馈选项
    onSelect(action, i) {
      console.log(action, i)
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.calcelText = '返回'
      } else if (action.name === '不感兴趣') {
        // 把新闻id传给父组件
        this.$emit('emitArtId', this.newsRecommended.art_id)
        this.show = false
      } else {
        // 把新闻id传给父组件，与级对话的举报类型和remark
        this.$emit('emitReportArticle', {
          target: this.newsRecommended.art_id,
          type: i,
          remark: action.name
        })
        this.show = false
      }
    },

    // 反馈组件取消按钮
    onCancel() {
      if (this.calcelText === '返回') {
        this.actions = firstActions
        this.calcelText = '取消'
        this.show = true
      }
    },
    // 关闭反馈组件时触发事件
    onclose() {
      this.calcelText = '取消'
      this.actions = firstActions
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 226px;
  height: 140px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>

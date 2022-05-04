<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="closeChannel" />
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            {{show ? '点击删除频道' : '点击进入频道'}}
          </span>
        </span>
        <span @click="editShow">{{show ? '完成' : '编辑'}}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in UserChannel" :key="item.id" @click="enterChannel(item)">
          <div class="channel-item van-hairline--surround">
            {{item.name}}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge" v-if="show && item.id!==0">
              <template #content>
                <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="0.32rem" @click="removeChannel(item.id)" />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in filtersChannel" :key="item.id" @click="addChannel(item)">
          <div class="channel-item van-hairline--surround">{{item.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: ['UserChannel', 'filtersChannel'],
  data () {
    return {
      // 控制删除图标的显示与隐藏
      show: false
    }
  },
  methods: {
    // 编辑用户频道列表
    editShow () {
      this.show = !this.show
      this.edit = '完成'
    },
    // 添加频道向父传值
    addChannel (obj) {
      if (this.show === true) {
        this.$emit('moreChannelEm', obj)
      }
    },
    // 删除频道
    removeChannel (id) {
      this.$emit('removeChannel', id)
    },
    // 退出频道
    closeChannel () {
      this.$emit('closeChannel')
      this.show = false
    },
    // 进入频道
    enterChannel (obj) {
      if (!this.show) {
        this.$emit('enterChannel', obj)
      }
    }
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 180px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 28px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 30px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 16px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    line-height: 56px;
    padding: 0 12px;
  }
}

.channel-item {
  font-size: 24px;
  text-align: center;
  line-height: 72px;
  background-color: #fafafa;
  margin: 2 * 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -6px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 20px;
  color: gray;
}
</style>

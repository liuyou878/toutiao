<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.photo" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ UserInfoList.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>0</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ UserInfoList.like_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ UserInfoList.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_editor" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="logout" />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfoAPI } from '@/api/user'
import { removeToken } from '@/utils/token'
import { mapMutations } from 'vuex'
export default {
  name: 'User',
  created() {
    // 初始化请求用户信息并保存在本地数组中
    this.getUserInfoList()
  },
  data() {
    return {
      UserInfoList: []
    }
  },
  methods: {
    // 获取用户信息并保存在本地数组中
    getUserInfoList() {
      getUserInfoAPI().then((data) => {
        this.UserInfoList = data.data.data
        this.GETPHOTO(this.UserInfoList.photo)
      })
    },
    // 退出登录
    logout() {
      this.$dialog
        .confirm({
          title: '是否退出',
          message: '退出请点确认'
        })
        .then(() => {
          // on confirm
          removeToken('token')
          this.$notify({ type: 'success', message: '退出成功' })
          this.$router.replace('/login')
        })
        .catch(() => {
          // on cancel
        })
    },
    ...mapMutations(['GETPHOTO'])
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>

<template>
  <div class="login-container">
    <!-- 导航条 -->
    <van-nav-bar title="登录" />
    <!-- 手机号与验证码输入框 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        left-icon="smile-o"
        required
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '手机号输入不正确', pattern: /^1[3456789]\d{9}$/ }]"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        required
        name="密码"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '验证码不能为空', pattern: /^\d{6}$/ }]"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-count-down
            :time="1000 * 5"
            format="ss 秒"
            v-if="showCountDown"
            @finish="showCountDown = false"
          />
          <van-button size="small" type="primary" native-type="button" @click="sendCode" v-else
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <!-- 提交登录按钮 -->
      <van-button block type="info" native-type="submit">登录</van-button>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user.js'
import { saveToken } from '@/utils/token.js'
export default {
  name: 'Login',
  data() {
    return {
      // 表单
      user: {
        mobile: '18565572545',
        code: '246810'
      },
      // 倒计时显示
      showCountDown: false
    }
  },
  methods: {
    // 点击登陆
    async onSubmit() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const data = await login(this.user)
        this.$toast.success('登陆成功')
        this.$router.replace({
          path: this.$route.query.path || '/'
        })
        saveToken(data.data.data.token)
        saveToken(data.data.data.refresh_token, 'refresh_token')
      } catch (error) {
        console.log(error.message)
        this.$toast.fail('登陆失败')
      }
    },
    // 发送验证码
    async sendCode() {
      try {
        await this.$refs.loginForm.validate('mobile')
        this.showCountDown = true
      } catch (error) {
        return console.log('失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 导航登录去掉伪元素小边框
.van-hairline--bottom::after {
  border: none;
}
// 图标大小
i.iconfont {
  font-size: 37px;
  color: #666;
}
// 验证码
.van-button--primary {
  width: 152px;
  height: 46px;
  background-color: #ededed;
  border-radius: 23px;
  border: none;
  color: #666666;
  font-size: 22px;
  // 小竖线
  .van-button__content::before {
    width: 2px;
    height: 46px;
    background-color: #eeeeee;
    position: absolute;
    left: -25px;
  }
}
// 提交按钮样式
.van-button--block {
  background-color: #6db4fb;
  border: none;
  width: 694px;
  height: 88px;
  margin: 53px 28px 0 28px;
}
</style>

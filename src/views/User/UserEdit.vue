<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="$store.state.photo" @click="imageClickFn" />
          <!-- file 选择框 -->
          <input type="file" ref="iptFile" v-show="show" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="UserProfileData.name" @click="editName" />
      <van-dialog
        v-model="inputshow"
        title="修改名字"
        show-cancel-button
        :beforeClose="beforeClose"
      >
        <van-field v-model.trim="text" placeholder="请输入名称" input-align="center" ref="id" />
      </van-dialog>
      <van-cell title="生日" is-link :value="UserProfileData.birthday" @click="briClickDialog" />
    </van-cell-group>
    <!-- 修改生日弹出层 -->
    <van-popup v-model="briDialogshow" position="bottom" :style="{ height: '50%' }" round>
      <van-datetime-picker
        @confirm="popupConfirm"
        @cancel="popupCancel"
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfileAPI, editUserPhotoAPI, editUserInfoAPI } from '@/api/user'
import { mapMutations } from 'vuex'
import { timeFormat } from '@/utils/dayjs'
export default {
  name: 'UserEdit',
  data() {
    return {
      UserProfileData: {},
      show: false,
      text: '',
      inputshow: false,
      briDialogshow: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()
    }
  },
  created() {
    this.getUserProfileData()
  },
  methods: {
    // 获取用户个人资料
    getUserProfileData() {
      getUserProfileAPI().then((data) => {
        this.UserProfileData = data.data.data
      })
    },
    // fill上传变化事件
    onFileChange(e) {
      console.log(e.target)
      if (e.target.files.length === 0) return
      const fd = new FormData()
      fd.append('photo', e.target.files[0])
      editUserPhotoAPI(fd).then((data) => {
        this.UserProfileData.photo = data.data.data.photo
        this.GETPHOTO(data.data.data.photo)
      })
    },
    // 图片点击事件
    imageClickFn() {
      this.$refs.iptFile.click()
    },
    // 修改名称
    editName() {
      this.inputshow = true
      this.text = this.UserProfileData.name
      this.$nextTick(() => {
        this.$refs.id.focus()
      })
    },
    // 关闭修改对话框之前的逻辑
    beforeClose(action, done) {
      // 判定是否点击的确认
      if (action === 'confirm') {
        // 输入的名称正则
        const reg = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,7}/
        // 判断正则是否匹配
        if (reg.test(this.text)) {
          // 向服务器同步用户名称
          editUserInfoAPI({ name: this.text }).then((data) => {
            // 把本地的用户名称改过来
            this.UserProfileData.name = this.text
            // 关闭
            done()
          })
        } else {
          // 正则没有匹配上，提醒用户再次输入
          this.$notify({ type: 'warning', message: '请输入1-7位以内' })
        }
        // 点击取消则直接关闭对话框
      } else {
        done()
      }
    },
    // 显示生日弹出框
    briClickDialog() {
      this.briDialogshow = true
      this.currentDate = new Date(this.UserProfileData.birthday)
    },
    // 生日弹出框点击确认
    popupConfirm() {
      editUserInfoAPI({ birthday: timeFormat(this.currentDate) }).then((data) => {
        this.UserProfileData.birthday = timeFormat(this.currentDate)
        this.briDialogshow = false
      })
    },
    // 生日弹出框点击取消
    popupCancel() {
      this.briDialogshow = false
    },
    ...mapMutations(['GETPHOTO'])
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px * 2;
  .avatar {
    width: 50px * 2;
    height: 50px * 2;
  }
  /deep/ .van-dialog__content {
    text-align: center;
    .inputaa {
      border: none;
      text-align: center;
      font-size: 40px;
      height: 100px;
    }
  }
}
</style>

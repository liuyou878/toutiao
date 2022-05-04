<template>
  <div class="home">
    <van-nav-bar fixed>
      <template #left>
        <img src="@/assets/logo.png" alt="" class="logo" />
      </template>
      <template #right>
        <van-icon name="search" size="0.48rem" color="#fff" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>
    <!-- 标签页 -->
    <div class="tabTop">
      <van-tabs
        v-model="active"
        sticky
        offset-top="1.22667rem"
        animated
        :before-change="beforechangeTab"
        @change="changeTab(active)"
      >
        <van-tab :title="item.name" v-for="item in UserChannel" :key="item.id" :name="item.id">
          <ArticleList :active="active"></ArticleList>
        </van-tab>
      </van-tabs>
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="AllChannel" />
    </div>
    <!-- 频道管理页面 -->
    <van-popup v-model="show" class="self-popup">
      <ChannelEdit
        @enterChannel="enterChannel"
        @closeChannel="show = false"
        @removeChannel="removeChannel"
        @moreChannelEm="moreChannelEm"
        :UserChannel="UserChannel"
        :filtersChannel="filtersChannel"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannel, getAllChannel, getAddChannel } from '@/api/user'
// import { getAllChannel } from '@api/user'
import ArticleList from '@/components/Home/ArticleList'
import ChannelEdit from '@/components/Home/ChannelEdit'
export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      // tab标签默认选择
      active: 0,
      // 用户列表数据
      UserChannel: [],
      // 控制频道管理显示与隐藏
      show: false,
      // 所有频道列表
      AllChannelList: [],
      nameTo: {}
    }
  },
  created() {
    // 获取用户频道信息
    getUserChannel().then(({ data }) => {
      this.UserChannel = data.data.channels
    })
    // 获取所有频道信息
  },
  methods: {
    // 添加频道
    async moreChannelEm(obj) {
      this.UserChannel.push(obj)
      // const newList = this.UserChannel.filter(item => item.id !== 0)
      // const aa = newList.map((item, i) => {
      //   return {
      //     id: item.id,
      //     seq: i + 1
      //   }
      // })
      await getAddChannel(this.UserChannel)
      // const { data } = await getAddChannel(aa)
      // data.data.channels.forEach(item => {})
    },
    // 删除频道
    async removeChannel(id) {
      const index = this.UserChannel.findIndex((obj) => obj.id === id)
      this.UserChannel.splice(index, 1)
      await getAddChannel(this.UserChannel)
    },
    // 进入频道
    enterChannel(obj) {
      this.show = false
      this.active = obj.id
    },
    // 获取所有频道信息
    AllChannel() {
      this.show = true
      getAllChannel().then(({ data }) => {
        this.AllChannelList = data.data.channels
      })
    },
    // tab切换之前的回调函数
    beforechangeTab() {
      this.nameTo[this.active] = window.scrollY
      console.log(this.nameTo[this.active])
      return true
    },
    // tab切换后的函数
    changeTab(id) {
      // console.log(id)
      this.$nextTick(() => {
        window.scrollTo(0, this.nameTo[id] || 0)
      })
    }
    // ,
    // listonSc() {
    //   window.addEventListener('scroll', () => {
    //     console.log(window.scrollY)
    //     this.$route.meta.top = window.scrollY
    //     console.log(this.$route.meta.top)
    //   })
    // }
  },
  computed: {
    // 筛选用户没有选择的频道
    filtersChannel() {
      const moreChannel = this.AllChannelList.filter((obj) => {
        const index = this.UserChannel.findIndex((obj2) => obj.id === obj2.id)
        if (index === -1) return true
      })
      return moreChannel
    }
  },

  beforeRouteLeave(to, from, next) {
    console.log(window.scrollY)
    from.meta.top = window.scrollY
    next()
  }
  // deactivated() {
  //   window.removeEventListener('scroll', this.listonSc)
  // },
  // activated() {
  //   this.listonSc()
  //   window.scrollY = this.$route.meta.top
  // }
}
</script>

<style scoped lang="less">
.logo {
  width: 200px;
  height: 60px;
}
.tabTop {
  margin-top: 1.22667rem;
  margin-bottom: 1.333rem;
  /* // 设置 tabs 容器的样式 */
  /deep/ .van-tabs__wrap {
    padding-right: 60px;
    background-color: #fff;
    display: flex;
  }
  /deep/ .van-tabs__wrap--scrollable .van-tab {
    padding: 0 0.3rem;
  }
  /* // 设置小图标的样式 */
  .moreChannels {
    position: fixed;
    top: 120px;
    right: 16px;
    z-index: 99;
  }
}
// 频道管理宽高
.self-popup {
  height: 100vh;
  width: 100vw;
}
</style>

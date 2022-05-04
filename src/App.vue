<template>
  <div>
    <!-- 路由的出口 -->
    <keep-alive exclude="Login,Search,SearchResult,ArticleDetail,UserEdit">
      <router-view></router-view>
    </keep-alive>
    <!-- loading -->
    <loading v-show="isLoading"></loading>
  </div>
</template>
<script>
import loading from '@/components/Loading'
import { mapState } from 'vuex'
export default {
  name: 'App',
  components: { loading },
  computed: { ...mapState(['isLoading']) }
}
</script>

<style lang="less">
.loading {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  padding-top: 4.333333rem;
}
</style>

<template>
  <div class="Home">
    <router-view ref="homeChild" class="home-child" :propData="propData" :cordova="cordova"></router-view>
    <footer>
      <nav class="clearfix">
        <a href="javascript:void(0)" v-for="(value, index) in nav" @click="clickNav(index)" :key="index" :class="{current: value.statu}"><i></i> <p>{{value.txt1}}<br>{{value.txt2}}</p></a>
        <!-- <a href="javascript:void(0)" class="current"><i></i> <p>活动首页<br>活动首页</p></a> -->
      </nav>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: ['propData', 'cordova'],
  data () {
    return {
      nav: [ // 导航栏
        {
          txt1: '活动首页', // 显示文字
          statu: 1
        },
        {
          txt1: '大力神杯', // 显示文字
          txt2: '（赢积分）', // 显示文字
          statu: 0
        },
        {
          txt1: '我的竞猜', // 显示文字
          statu: 0
        }
      ]
    }
  },
  watch: {
    '$route' () { // 切换路由时，前进后退使用不同动画
      this.toTop()
    }
  },
  methods: {
    /**
     * 点击导航栏
     */
    clickNav: function (index) {
      // 如果未加载完成
      if (!this.propData.userinfo.loadingCompleted) return
      // 定义变量接收所有name
      var names = ['tab1', 'tab2', 'tab3']
      // 埋点id
      var eventID = ['ylb_WC_Index_Index', 'ylb_WC_Index_JRcup', 'ylb_WC_Index_Myrecord']
      // 优理宝ylb_世界杯_tab 埋点
      window.TDAPP.onEvent(eventID[index], '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      // 如果点击tab3 且在优理宝中 且未登录
      if (index === 2 && this.GLOBAL.getQueryString('inUlb') && !this.propData.userinfo.isLogin) {
        // 重新登陆
        this.cordova({
          reloginflag: '1',
          accounttype: '1'
        })
        return
      }
      // 改变导航栏状态
      for (let i = 0; i < this.nav.length; i++) {
        this.$set(this.nav[i], 'statu', 0)
      }
      this.$set(this.nav[index], 'statu', 1)
      // 切换路由
      this.$router.replace({name: names[index]})
    },
    /**
     * 防止页面刷新后导航栏样式错乱
     */
    keepStyle: function () {
      // 定义所有name数组
      var names = ['tab1', 'tab2', 'tab3']
      // 通过当前路由name获取索引值
      var index = 0
      if (this.$route.name !== 'rule') {
        index = names.indexOf(this.$route.name)
      }
      // 改变导航栏状态
      for (let i = 0; i < this.nav.length; i++) {
        this.$set(this.nav[i], 'statu', 0)
      }
      this.$set(this.nav[index], 'statu', 1)
    },
    toTop: function () {
      // console.log(this.$refs.homeChild.$el.scrollTop)
      this.$refs.homeChild.$el.scrollTop = 0
    }
  },
  beforeMount: function () {
    this.keepStyle()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.Home{
  position: relative;
  .home-child{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box; /* Safari */
    .container{
      height: auto!important;
      background: url(../../assets/invitation_bg.png) no-repeat left top;
      background-size: 100% auto;
      padding-bottom: .972222rem; /* 140 */
      background-color: #B72322;
    }
  }
  footer{
    position: absolute;
    bottom: 0;
    left: 0;
    height: .972222rem; /* 140 */
    background: #fff;
    width: 100%;
    >nav{
      height: 100%;
      a{
        float: left;
        width: 33.33%;
        padding-top: .208333rem; /* 30 */
        height: 100%;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        line-height: .5625rem; /* 81 */
        font-family: PingFangSC-Regular;
        font-size: .263889rem; /* 38 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #333;
        text-align: center;
        position: relative;
        &:nth-child(1), &:nth-child(2){
          &::after{
            content: '';
            position: absolute;
            right: 0;
            top: .3125rem; /* 15 */
            width: .013889rem; /* 2 */
            height: .354167rem; /* 51 */
            background-color: #ccc;
          }
        }
        &.current{
          color: #d81c1d;
        }
        i{
          display: inline-block;
          height: .548611rem; /* 79 */
          vertical-align: middle;
          background-size: 100% 100%;
        }
        p{
          display: inline-block;
          vertical-align: middle;
        }
        &:nth-child(1) i{
          width: .472222rem; /* 68 */
          background-image: url("../../assets/ico_Architecture.png");
        }
        &:nth-child(2){
          line-height: .3125rem;
          i{
            width: .270833rem; /* 39 */
            background-image: url("../../assets/ico_Trophy.png");
          }
        }
        &:nth-child(3) i{
          width: .569444rem; /* 82 */
          height: .479167rem; /* 69 */
          background-image: url("../../assets/ico_baby.png");
        }
      }
    }
  }
}
</style>

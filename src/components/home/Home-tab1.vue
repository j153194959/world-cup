<template>
  <div class="Home_tab1">
    <div class="share" @click="gotoShare"></div>
    <div class="container">
      <!-- <div class="logo"><img src="../../assets/ico_logo2.png" alt=""></div> -->
      <ul>
        <li v-for="(value, index) in links" :key="index">
          <a href="javascript:void(0)" @click="toLink(value.statu, index)" :class="['a' + (index + 1)]">
            <p>{{value.txt}}</p>
            <div>
              <a :class="{disabled: value.statu !== 1}" href="javascript:void(0)">{{value.statu | getStatu}}</a>
              <p>{{value.time}}</p>
            </div>
          </a>
        </li>
      </ul>
      <div class="rule">
        <h3>活动规则</h3>
        <p>
          此规则与条款将适用于本活动所有的投注种类。参与用户有责任确保您获知所有的规则与条款，我们保留随时修改条款的权利，并...
          <router-link :to="{name: 'rule'}">查看详情&gt;</router-link>
          <!-- <a href="javascript:void(0)"></a> -->
        </p>
      </div>
    </div>
    <!-- 加载 -->
    <Loading v-show="mask.loading"></Loading>
    <!-- 每日领取积分 -->
    <transition name="fade">
      <div class="points-fail" v-if="mask.everyday && isGetPointStatu !== 0">
        <div class="cover"></div>
        <div class="fail">
          <h3>天降积分~</h3>
          <div>
            <span>每天限量领取！</span>
          </div>
          <button @click="getPointData">立即领取</button>
          <i @click.self="closed"></i>
        </div>
      </div>
    </transition>
    <!-- 每日领取积分-成功 -->
    <transition name="fade">
      <div class="points-success" v-show="mask.everydaySuccess">
        <div class="cover"></div>
        <div class="success">
          <h3>恭喜您成功领取{{points}}积分</h3>
          <div>
            <span>参与世界杯竞猜活动</span>
            <span>玩转积分，赢取海量电子券！</span>
          </div>
          <i @click.self="mask.everydaySuccess = false"></i>
        </div>
      </div>
    </transition>
    <!-- 每日领取积分-已领取过 1012-->
    <transition name="fade">
      <div class="points-everydayFail" v-show="mask.everydayFail">
        <div class="cover"></div>
        <div class="success">
          <h3>手慢啦，今日限量惊喜已领取完<br>参与活动赢取积分吧~</h3>
          <i @click.self="mask.everydayFail = false"></i>
        </div>
      </div>
    </transition>
    <!-- 每日领取积分-已领取过 1011-->
    <transition name="fade">
      <div class="points-everydayHas" v-show="mask.everydayHas">
        <div class="cover"></div>
        <div class="success">
          <h3>亲，今天您已经领过啦<br>快参加世界杯竞猜吧！</h3>
          <i @click.self="mask.everydayHas = false"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Loading from '../common/Loading'

export default {
  name: 'Home_tab1',
  data () {
    return {
      links: [
        {
          txt: '我心中的足球先生(票选最喜爱的球员赢积分)', // p标签描述
          time: '时间：即日起-6月30日', // 活动时间
          statu: 1
        },
        {
          txt: '独赢盘(竞猜每日单场竞赛的“胜”“负”或“平”)', // p标签描述
          time: '时间：即日起-7月15日', // 活动时间
          statu: 1
        },
        {
          txt: '冠军盘(竞猜冠军球队瓜分1亿积分)', // p标签描述
          time: '时间：即日起-6月24日', // 活动时间
          statu: 1
        }
      ],
      mask: { // 弹窗控制
        loading: false, // 加载
        everyday: true, // 每日领取积分
        everydaySuccess: false, // 每日领取积分-成功
        everydayFail: false, // 已经领取过积分或库存不足 1012
        everydayHas: false // 已经领取过积分或库存不足 1011
      },
      points: '100', // 获取的积分
      isGetPointStatu: 0
    }
  },
  components: { // 公共组件
    Loading
  },
  props: ['propData', 'cordova'],
  filters: {
    /**
     * 获取状态
     * statu 当前状态码
     */
    getStatu: function (statu) {
      var arr = ['未开始', '进行中', '已结束']
      return arr[statu]
    }
  },
  watch: {
    loadingCompleted: function (to, from) {
      // console.log(to, from)
      setTimeout(() => {
        if (!from) this.getPointStatu()
      }, 100)
    }
  },
  methods: {
    /**
     * 获取数据
     */
    getData: function () {
      this.mask.loading = true
      this.$ajax({
        url: '/index'
      }).then((res) => {
        const Data = res.data.respbody
        // 给当前状态赋值
        for (let i = 0; i < Data.length; i++) {
          this.links[i].statu = Data[i].status
        }
        this.mask.loading = false
      }).catch((err) => {
        console.log(err)
        this.mask.loading = false
      })
    },
    /**
     * 点击链接
     * statu 当前状态
     * index 当前索引
     */
    toLink: function (statu, index) {
      // alert(this.propData.userinfo.loadingCompleted)
      // 如果未加载完成
      if (!this.propData.userinfo.loadingCompleted) return
      var linkName = ['activity1', 'activity3', 'activity2']
      // 埋点id
      var eventID = ['ylb_WC_Index_Mister', 'ylb_WC_Index_Handicap', 'ylb_WC_Index_Champion']
      // 优理宝ylb_世界杯_链接 埋点
      window.TDAPP.onEvent(eventID[index], '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      if (this.GLOBAL.getQueryString('inUlb') && !this.propData.userinfo.isLogin) { // 在app中且未登录
        // 重新登陆
        this.cordova({
          reloginflag: '1',
          accounttype: '1'
        })
        return
      }
      // this.$router.push({name: linkName[index]})
      if (statu === 1) { // 活动正在进行中
        this.$router.push({name: linkName[index]})
      }
    },
    /**
     * 分享
     */
    gotoShare () {
      // console.info('分享')
      navigator.uniaccount.ulbShare('超燃世界杯足球竞猜', 'https://static.xyzq.cn/activity/world-cup/static/images/share_icon.png', '竞猜冠军瓜分1亿积分，点击查看小组赛收视指南', 'https://static.xyzq.cn/activity/cgds_article/20180614/index.html')
    },
    /**
     * 关闭每日领取积分
     */
    closed () {
      this.mask.everyday = false
    },
    /**
     * 领取积分
     */
    getPoint () {
      console.info(this.propData.userinfo.xuid)
      this.$ajax({
        url: '/gift',
        params: {
          xid: this.propData.userinfo.xuid // xid
        }
      }).then((res) => {
        console.log(res)
        // 1011 已领取 1012 手慢了
        if (res.data.resphead.respcode === '0000') {
          this.points = res.data.respbody
          this.mask.everyday = false
          setTimeout(() => {
            this.mask.everydaySuccess = true
          }, 200)
        } else if (res.data.resphead.respcode === '1012') {
          this.mask.everyday = false
          setTimeout(() => {
            this.mask.everydayFail = true
          }, 200)
        } else if (res.data.resphead.respcode === '1011') {
          this.mask.everyday = false
          setTimeout(() => {
            this.mask.everydayHas = true
          }, 200)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 积分库存足够时，即isGetPointStatu为1时
     */
    getPointData () {
      // 如果未加载完成
      if (!this.propData.userinfo.loadingCompleted) return
      // 登陆状态
      if (this.propData.userinfo.isLogin) {
        this.getPoint()
      } else {
        // 重新登陆
        this.cordova({
          reloginflag: '1',
          accounttype: '1'
        })
      }
    },
    /**
     * 积分可领取状态
     */
    getPointStatu () {
      this.$ajax({
        url: '/giftStatus',
        params: {
          xid: this.propData.userinfo.xuid // xid
        }
      }).then((res) => {
        // 是否已经获取过100积分状态isGetPointStatu 0-不能领取，1-可领取
        this.isGetPointStatu = res.data.respbody.status
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  computed: {
    loadingCompleted: function () {
      return this.propData.userinfo.loadingCompleted
    }
  },
  mounted: function () {
    this.getData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Home_tab1{
  position: relative;
  .share{
    position: absolute;
    right: 0;
    top: .3472rem; /* 50 */
    height: .4375rem; /* 63 */
    width: 1.2917rem; /* 186 */
    background: url(../../assets/share.png) no-repeat;
    background-size: 100% 100%;
  }
  .container{
    > ul{
      padding-top: 6.076389rem; /* 875 */
      li{
        padding-bottom: .555556rem; /* 80 */
        >a{
          display: block;
          width: 6.777778rem; /* 976 */
          margin: 0 auto;
          height: 3.465278rem; /* 499 */
          background-size: contain;
          background-repeat: no-repeat;
          padding-top: 1.993056rem;
          box-sizing: border-box;
          -moz-box-sizing:border-box; /* Firefox */
          -webkit-box-sizing:border-box; /* Safari */
          &.a1{
            background-image: url("../../assets/zuqiuxiansheng_banner.png");
          }
          &.a2{
            background-image: url("../../assets/duyingpan_banner.png");
          }
          &.a3{
            background-image: url("../../assets/guanjunpan_banner.png");
          }
          > p{
            width: 6.631944rem; /* 955 */
            margin: 0 auto;
            height: .659722rem; /* 95 */
            line-height: .659722rem; /* 95 */
            font-family: PingFangSC-Regular;
            font-size: .263889rem; /* 38 */
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #fff;
            box-sizing: border-box;
            -moz-box-sizing:border-box; /* Firefox */
            -webkit-box-sizing:border-box; /* Safari */
            padding-left: .194444rem; /* 28 */
            /* background-color: rgba(0, 0, 0, 0.6); */
            background-image: -webkit-linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
            background-image: -o-linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
            background-image: -moz-linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
            background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
          }
          > div{
            p{
              height: .8125rem; /* 117 */
              line-height: .8125rem; /* 117 */
              font-family: PingFangSC-Regular;
              font-size: .291667rem; /* 42 */
              font-weight: normal;
              font-stretch: normal;
              letter-spacing: 0px;
              color: #333;
              padding-left: .270833rem; /* 39 */
            }
            a{
              float: right;
              width: 1.506944rem; /* 217 */
              height: .506944rem; /* 73 */
              line-height: .506944rem; /* 73 */
              background-image: -webkit-linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
              background-image: -o-linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
              background-image: -moz-linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
              background-image: linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
              font-family: PingFangSC-Regular;
              font-size: .277778rem; /* 40 */
              font-weight: normal;
              font-stretch: normal;
              letter-spacing: 0px;
              color: #fff;
              margin-right: .277778rem; /* 40 */
              border-radius: .256944rem; /* 37 */
              text-align: center;
              margin-top: .152778rem;
              &.disabled{
                background: #b5b5b5;
              }
            }
          }
        }
      }
    }
    > .rule{
      padding-bottom: .694444rem;
      h3{
        width: 2.881944rem; /* 415 */
        height: .326389rem; /* 47 */
        line-height: .326389rem; /* 47 */
        background-image: url("../../assets/ico_rules.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        font-family: PingFangSC-Regular;
        font-size: .347222rem; /* 50 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #ffdddd;
        text-align: center;
        margin: 0 auto;
      }
      p{
        margin: .3125rem auto 0;
        width: 6.75rem; /* 972 */
        font-family: PingFangSC-Regular;
        font-size: .270833rem; /* 39 */
        font-weight: normal;
        font-stretch: normal;
        line-height: .416667rem; /* 60 */
        letter-spacing: 0px;
        color: #ffdddd;
      }
    }
  }
  /* 每日领取积分 */
  .points-fail{
    position: fixed;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    .cover{
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      background-size: 100% 100%;
      background: #000;
      background: rgba(0, 0, 0, 0.5 );
    }
    .fail{
      width: 5.6944rem; /* 820 */
      height: 5.375rem; /* 774 */
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -2.8472rem;
      margin-top: -2.6875rem;
      background: url(../../assets/ico_pop_background_jifenbuzu.png) no-repeat center center;
      background-size: 100% 100%;
      h3{
        margin-top: 1.875rem; /* 270 */
        // height: .4236rem; /* 61 */
        font-family: PingFangSC-Regular;
        font-size: .4444rem; /* 64 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #fdfaff;
        text-align: center;
      }
      div{
        span{
          display: block;
          font-family: PingFangSC-Regular;
          font-size: .3472rem; /* 50 */
          font-weight: normal;
          font-stretch: normal;
          line-height: .3472rem; /* 50 */
          letter-spacing: .0069rem; /* 1 */
          color: #fdfaff;
          margin: .4rem 0;
          text-align: center;
        }
        span:nth-of-type(2){
          font-size: .3611rem; /* 52 */
        }
      }
      button{
        display: block;
        margin: .8333rem auto 0; /* 120 */
        border: 0 none;
        outline: none;
        width: 2.7986rem; /* 403 */
        height: .6736rem; /* 97 */
        line-height: .6736rem; /* 97 */
        background: #fff0e5;
        box-shadow: 0px .0694rem .2083rem 0px rgba(137, 6, 0, 0.4); /* 10 30 */
        border-radius: .3333rem; /* 48 */
        font-family: PingFangSC-Regular;
        font-size: .3958rem; /* 57 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: .0139rem; /* 2 */
        color: #e94d2f;
      }
      i{
        position: absolute;
        width: .7917rem; /* 114 */
        height: .7917rem; /* 114 */
        left: 50%;
        margin-left: -.3958rem; /* 57 */
        bottom: -1.2rem;
        background: url(../../assets/ico_close.png) no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
  /* 每日领取积分-成功 */
  .points-success{
    position: fixed;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    .cover{
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      background-size: 100% 100%;
      background: #000;
      background: rgba(0, 0, 0, 0.5 );
    }
    .success{
      width: 5.6944rem; /* 820 */
      height: 3.5833rem; /* 516 */
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -2.8472rem; /* 410 */
      margin-top: -1.7917rem; /* 258 */
      background: url(../../assets/ico_pcp_background_jingcaichenggong.png) no-repeat center center;
      background-size: 100% 100%;
      h3{
        margin-top: 1.5972rem; /* 230 */
        font-family: PingFangSC-Regular;
        font-size: .4028rem; /* 58 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #fdfaff;
        text-align: center;
      }
      div{
        span{
          display: block;
          font-family: PingFangSC-Regular;
          font-size: .3333rem; /* 48 */
          font-weight: normal;
          font-stretch: normal;
          line-height: .3472rem; /* 50 */
          letter-spacing: .0069rem; /* 1 */
          color: #fdfaff;
          margin: .15rem 0;
          text-align: center;
        }
      }
      i{
        position: absolute;
        width: .7917rem; /* 114 */
        height: .7917rem; /* 114 */
        left: 50%;
        margin-left: -.3958rem; /* 57 */
        bottom: -1.2rem;
        background: url(../../assets/ico_close.png) no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
  /* 每日领取积分-已领取 1012*/
  .points-everydayFail{
    position: fixed;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    .cover{
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      background-size: 100% 100%;
      background: #000;
      background: rgba(0, 0, 0, 0.5 );
    }
    .success{
      width: 5.6944rem; /* 820 */
      height: 3.5833rem; /* 516 */
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -2.8472rem; /* 410 */
      margin-top: -1.7917rem; /* 258 */
      background: url(../../assets/ico_pcp_background_jingcaichenggong.png) no-repeat center center;
      background-size: 100% 100%;
      h3{
        margin-top: 1.875rem; /* 270 */
        font-family: PingFangSC-Regular;
        font-size: .4028rem; /* 58 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #fdfaff;
        text-align: center;
      }
      i{
        position: absolute;
        width: .7917rem; /* 114 */
        height: .7917rem; /* 114 */
        left: 50%;
        margin-left: -.3958rem; /* 57 */
        bottom: -1.2rem;
        background: url(../../assets/ico_close.png) no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
  /* 每日领取积分-已领取 1011*/
  .points-everydayHas{
    position: fixed;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    .cover{
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      background-size: 100% 100%;
      background: #000;
      background: rgba(0, 0, 0, 0.5 );
    }
    .success{
      width: 5.6944rem; /* 820 */
      height: 3.5833rem; /* 516 */
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -2.8472rem; /* 410 */
      margin-top: -1.7917rem; /* 258 */
      background: url(../../assets/ico_pcp_background_jingcaichenggong.png) no-repeat center center;
      background-size: 100% 100%;
      h3{
        margin-top: 1.875rem; /* 270 */
        font-family: PingFangSC-Regular;
        font-size: .4028rem; /* 58 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #fdfaff;
        text-align: center;
      }
      i{
        position: absolute;
        width: .7917rem; /* 114 */
        height: .7917rem; /* 114 */
        left: 50%;
        margin-left: -.3958rem; /* 57 */
        bottom: -1.2rem;
        background: url(../../assets/ico_close.png) no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
}
</style>

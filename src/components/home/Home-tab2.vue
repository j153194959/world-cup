<template>
  <div class="Home-tab2">
    <div class="container">
      <!-- 每日球星 -->
      <header>
        <!-- <div class="daily-star">
          <span class="date">{{starObj.date}}</span>
          <div>
            <h3>{{starObj.name}}</h3>
            <p>已获得<i>{{starObj.score * starObj.count}}</i>积分奖励</p>
            <span>(共邀请了<i>{{starObj.count}}</i>位好友)</span>
          </div>
        </div> -->
      </header>
      <!-- <p>*活动期间一个兴证通账号只限成为一次每日球星，每天0点清算</p> -->
      <div class="taskContainer">
        <ul>
          <li v-if="item.tag !== 8" v-for="(item, index) in taskList" :key="index">
            <div class="task">任务{{index + 1}}</div>
            <div class="taskDetail">
              <img :src="filterSrc(index)" alt="">
              <div>
                <h3>{{item.title}}</h3>
                <span>{{item.detail}}{{ index === 1 ? '最多可邀请15个' : '' }}</span>
              </div>
              <button :class="[getColor(item.status)]" @click="goFinish(index, item.status)">{{changeStatus(index, item.status)}}</button>
            </div>
          </li>
          <!-- <li>
            <div class="task">任务二</div>
            <div class="taskDetail">
              <img src="../../assets/ico_yaoqing.png" alt="">
              <div>
                <h3>邀请好友下载激活</h3>
                <span>每成功邀请1个好友即可获得<i>200</i>积分最多可邀请15个</span>
              </div>
              <button>立即前往</button>
            </div>
          </li>
          <li>
            <div class="task">任务三</div>
            <div class="taskDetail">
              <img src="../../assets/ico_zhanghao.png" alt="">
              <div>
                <h3>资金账号绑定行证通</h3>
                <span>完成绑定即可获得<i>100</i>积分</span>
              </div>
              <button>立即前往</button>
            </div>
          </li>
          <li>
            <div class="task">任务四</div>
            <div class="taskDetail">
              <img src="../../assets/ico_qiandao.png" alt="">
              <div>
                <h3>每日签到</h3>
                <span>每日玩转优理宝都有积分拿哦~</span>
              </div>
              <button>立即前往</button>
            </div>
          </li>
          <li>
            <div class="task">任务五</div>
            <div class="taskDetail">
              <img src="../../assets/ico_shenfen.png" alt="">
              <div>
                <h3>完成征信开通两融账户</h3>
                <span><i>2888</i>积分等你哟~(详询理财顾问)</span>
              </div>
              <button>立即前往</button>
            </div>
          </li>
          <li>
            <div class="task">任务六</div>
            <div class="taskDetail">
              <img src="../../assets/ico_libao.png" alt="">
              <div>
                <h3>新手礼包</h3>
                <span>新人们，我们准备了额外惊喜！</span>
              </div>
              <button>立即前往</button>
            </div>
          </li>
          <li>
            <div class="task">任务七</div>
            <div class="taskDetail">
              <img src="../../assets/ico_jiangbei.png" alt="">
              <div>
                <h3>我的大力神杯</h3>
                <span>完成任务一至任务六捧起大力神杯<i>666</i>积分</span>
              </div>
            </div>
          </li> -->
        </ul>
      </div>
    </div>
    <!-- 加载 -->
    <Loading v-show="mask.loading"></Loading>
  </div>
</template>

<script>
import Loading from '../common/Loading'
export default {
  name: 'Home-tab2',
  data () {
    return {
      // userInfo: this.propData, // 用户信息
      starObj: { // 每日球星
        name: '', // 名字
        count: '', // 共邀请好友数
        date: '', // 日期
        score: 280 // 得到邀请一位好友积分数
      },
      taskList: [], // 任务列表
      mask: {
        loading: false // 加载
      }
    }
  },
  props: ['propData', 'cordova'],
  mounted () {
    this.getData()
    // this.getStarOfTheDay()
  },
  components: { // 公共组件
    Loading
  },
  computed: {
    update: function () {
      return this.propData.userinfo.xuid
    }
  },
  watch: {
    update: function () {
      this.getData()
    }
  },
  methods: {
    /**
     * 获取数据
     */
    getData () {
      this.mask.loading = true // loading
      this.$ajax({
        url: '/duty',
        params: {
          xid: this.propData.userinfo.xuid
          // Client: 'ceshi',
          // Token: 'ceshi'
        }
      }).then((res) => {
        // console.info(res)
        this.taskList = res.data.respbody
        this.taskList[0].status = 1
        this.mask.loading = false // loading
      }).catch((error) => {
        console.info(error)
        this.mask.loading = false // loading
      })
    },
    /**
     * 过滤任务icon地址
     */
    filterSrc (index) {
      switch (index) {
        case 0:
          return './static/images/ico_toupiao.png'
        case 1:
          return './static/images/ico_yaoqing.png'
        case 2:
          return './static/images/ico_zhanghao.png'
        case 3:
          return './static/images/ico_qiandao.png'
        case 4:
          return './static/images/ico_shenfen.png'
        case 5:
          return './static/images/ico_libao.png'
        case 6:
          return './static/images/ico_jiangbei.png'
      }
    },
    /**
     * 按钮颜色
     */
    getColor (status) {
      if (status) {
        return 'finish'
      }
    },
    /**
     * 立即前往
     */
    goFinish (index, status) {
      var that = this
      // console.info(index, status)
      if (this.GLOBAL.getQueryString('inUlb')) {
        // 如果未加载完成
        if (!this.propData.userinfo.loadingCompleted) return
        if (!this.propData.userinfo.isLogin) { // 在app中且未登录
          // 重新登陆
          this.cordova({
            reloginflag: '1',
            accounttype: '1'
          })
        } else {
          if (!status) { // 任务(状态)未完成时
            switch (index) {
              case 0:
                // 跳转至活动1页面
                this.$router.push({name: 'activity1'})
                // 官微_猜盘指_我的竞猜 埋点
                window.TDAPP.onEvent('ylb_WC_Mister_Vote', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
                break
              case 1: // app分享
                // 获取到父组件app中的数据
                const shareData = this.$parent.$parent.shareData
                // 官微_猜盘指_我的竞猜 埋点
                window.TDAPP.onEvent('ylb_WC_Mister_Invite', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
                navigator.uniaccount.ulbShare(shareData.title, shareData.imgUrl, shareData.desc, shareData.outUrl)
                break
              case 2: // 资金账号绑定兴证通
                // 官微_猜盘指_我的竞猜 埋点
                window.TDAPP.onEvent('ylb_WC_Mister_Bind', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
                navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://estock.xyzq.com.cn/points/'})
                break
              case 3: // 每日签到
                // 官微_猜盘指_我的竞猜 埋点
                window.TDAPP.onEvent('ylb_WC_Mister_Register', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
                navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://estock.xyzq.com.cn/points/'})
                break
              case 4: // 完成征信开通两融账户
                // 获取登录信息
                navigator.uniaccount.ulbAccLogin((data) => {
                  var response = data
                  if (typeof data === 'string') {
                    response = JSON.parse(response)
                  }
                  // alert(JSON.stringify(response))
                  // 如果登录方式为不对则返回
                  // alert(response.respBody.userinfo.accountType)
                  if (response.respBody.userinfo.accountType !== '2') {
                    // that.openMask(2)
                    return
                  }
                  var phone = response.respBody.userinfo.mobile || ''
                  if (phone === that.propData.userinfo.phone) {
                    // alert(that.propData.userinfo.xuid)
                    // alert(response.respBody.userinfo.fundAccount)
                    // alert(response.respBody.logintoken)
                    that.$ajax({
                      url: '/creditReceive',
                      params: {
                        xid: that.propData.userinfo.xuid, // xid
                        account: response.respBody.userinfo.fundAccount, // 资金账号
                        token: response.respBody.logintoken
                      }
                    }).then((res) => {
                      // alert(JSON.stringify(res))
                      if (res.data.resphead.respcode === '000') {
                        alert('您的申请已提交，具体请联系您的理财顾问咨询详情')
                      } else if (res.data.resphead.respcode === '1010') {
                        alert('对不起，老用户无法领取！')
                      } else if (res.data.resphead.respcode === '2000') {
                        // 官微_猜盘指_我的竞猜 埋点
                        // alert('新用户')
                        window.TDAPP.onEvent('ylb_WC_Mister_Margin', '', {acc: that.propData.userinfo.account, tel: that.propData.userinfo.phone})
                        navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://estock.xyzq.com.cn/hallwap/biz/margincredit/index'})
                      }
                    }).catch((error) => {
                      console.info(error)
                    })
                  } else {
                    alert('请登录自己的资金账号！')
                    return false
                    // that.cordova({
                    //   reloginflag: '2',
                    //   accounttype: '1'
                    // })
                  }
                }, (data) => {
                  alert('未登录')
                }, {reloginflag: '0', accounttype: '2'})
                break
              case 5: // 新手礼包
                // 官微_猜盘指_我的竞猜 埋点
                window.TDAPP.onEvent('ylb_WC_Mister_Newbie', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
                navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://static.xyzq.cn/activity/gift/index.html'})
                break
              case 6:
                // alert('任务7')
                break
            }
          }
        }
      }
    },
    changeStatus (index, status) {
      if (index === 0) return '已结束'
      if (index === 4) {
        if (status) {
          return '已完成'
        } else {
          return '立即领取'
        }
      } else {
        if (status) {
          return '已完成'
        } else {
          return '立即前往'
        }
      }
    },
    /**
     * 每日球星
     */
    getStarOfTheDay () {
      this.mask.loading = true // loading
      this.$ajax({
        url: '/starOfTheDay',
        params: {
          xid: this.propData.userinfo.xuid
        }
      }).then((res) => {
        console.info(res)
        let resData = res.data.respbody
        this.starObj.name = resData.name
        this.starObj.count = resData.count
        this.starObj.date = resData.date
        this.mask.loading = false // loading
      }).catch((error) => {
        console.info(error)
        this.mask.loading = false // loading
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .Home-tab2{
    .container{
      header{
        // padding-top: 6.75rem;
        padding-top: 6rem;
      }
      .daily-star{
        width: 7.1458rem; /* 1029 */
        height: 2.6042rem; /* 375 */
        margin: .0903rem auto 0 auto; /* 13 */
        background: url(../../assets/daily_star.png) no-repeat center center;
        background-size: 100% 100%;
        font-family: PingFangSC-Regular;
        font-weight: normal;
        font-stretch: normal;
        position: relative;
        top: 0;
        left: 0;
        .date{
          position: absolute;
          top: .3403rem; /* 49 */
          right: .4375rem; /* 63 */
          font-size: .25rem; /* 36 */
          letter-spacing: 0px;
          color: #d81c1d;
        }
        div{
          position: absolute;
          left: 3.1319rem; /* 451 */
          top: .5347rem; /* 77 */
          font-size: .3889rem; /* 56 */
          letter-spacing: .0069rem; /* 1 */
          color: #d81c1d;
          p{
            font-size: .3194rem; /* 46 */
            letter-spacing: .0069rem; /* 1 */
            i{
              font-size: .3611rem; /* 52 */
            }
          }
          span{
            font-size: .2639rem; /* 38 */
            letter-spacing: .0069rem; /* 1 */
            i{
              font-size: .3056rem; /* 44 */
            }
          }
        }
      }
      >p{
        margin: 0 .3611rem .2083rem .3611rem; /* 52 30 */
        font-family: PingFangSC-Regular;
        font-size: .2222rem; /* 32 */
        font-weight: normal;
        font-stretch: normal;
        line-height: .3125rem; /* 45 */
        letter-spacing: 0px;
        color: #ffe1e1;
      }
      .taskContainer{
        padding-bottom: .4167rem; /* 60 */
        ul{
          width: 6.7708rem; /* 975 */
          // height: .8125rem; /* 117 */
          margin: 0 .3611rem 0 .3611rem; /* 52 */
          background: #fff3f3;
          -moz-box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
          -webkit-box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
          box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
          border-radius: .1389rem; /* 20 */
          // line-height: .8125rem;
          li{
            overflow: hidden;
            padding: 0 .2083rem; /* 30 */
            height: 1.3889rem; /* 200 */
            position: relative;
            left: 0;
            top: 0;
            display: box; /* OLD - Android 4.4- */
            display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
            display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
            display: -ms-flexbox; /* TWEENER - IE 10 */
            display: -webkit-flex; /* NEW - Chrome */
            display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
            .task{
              position: absolute;
              top: 0;
              left: .2222rem; /* 32 */
              width: .8333rem; /* 130 */
              height: .3972rem; /* 57.2 */
              background: url(../../assets/ico_renwu.png) no-repeat center center;
              background-size: 100% 100%;
              font-family: PingFangSC-Regular;
              font-size: .1806rem; /* 26 */
              font-weight: normal;
              font-stretch: normal;
              line-height: .3056rem; /* 44 */
              color: #ffffff;
              text-align: center;
            }
            .taskDetail{
              -webkit-box-flex: 100; /* OLD - iOS 6-, Safari 3.1-6 */
              -moz-box-flex: 100; /* OLD - Firefox 19- */
              // width: 20%; /* For old syntax, otherwise collapses. */
              -webkit-flex: 100; /* Chrome */
              -ms-flex: 100;  /* IE 10 */
              flex: 100; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              display: box; /* OLD - Android 4.4- */
              display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
              display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
              display: -ms-flexbox; /* TWEENER - IE 10 */
              display: -webkit-flex; /* NEW - Chrome */
              display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              -webkit-box-pack: space-around;
              /* 12版 */
              -webkit-justify-content: space-around;
              -moz-justify-content: space-around;
              -ms-justify-content: space-around;
              -o-justify-content: space-around;
              justify-content: space-around;
              /* 09版 */
              -webkit-box-align: center;
              /* 12版 */
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
              -o-align-items: center;
              align-items: center;
              // margin: auto 0;
              font-family: PingFangSC-Regular;
              font-weight: normal;
              font-stretch: normal;
              color: #d81c1d;
              >img{
                margin-top: .1806rem; /* 26 */
                margin-left: .25rem; /* 36 */
                width: .6944rem; /* 100 */
              }
              >div:nth-of-type(1){
                  -webkit-box-flex: 70; /* OLD - iOS 6-, Safari 3.1-6 */
                  -moz-box-flex: 70; /* OLD - Firefox 19- */
                  // width: 20%; /* For old syntax, otherwise collapses. */
                  -webkit-flex: 70; /* Chrome */
                  -ms-flex: 70;  /* IE 10 */
                  flex: 70; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                  font-weight: normal;
                  font-stretch: normal;
                  color: #d81c1d;
                  font-family: PingFangSC-Regular;
                  margin: 0 .0694rem 0 .2083rem; /* 10 30 */
                  display: box; /* OLD - Android 4.4- */
                  display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
                  display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
                  display: -ms-flexbox; /* TWEENER - IE 10 */
                  display: -webkit-flex; /* NEW - Chrome */
                  display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                  -webkit-flex-direction: column;
                  -moz-flex-direction: column;
                  -ms-flex-direction: column;
                  -o-flex-direction: column;
                  flex-direction: column;
                  -webkit-box-pack: space-around;
                  /* 12版 */
                  -webkit-justify-content: space-around;
                  -moz-justify-content: space-around;
                  -ms-justify-content: space-around;
                  -o-justify-content: space-around;
                  justify-content: space-around;
                h3{
                  font-size: .2639rem; /* 38 */
                  letter-spacing: .0069rem; /* 1 */
                }
                span{
                  font-size: .2222rem; /* 32 */
                  letter-spacing: 0px;
                  i{
                    font-size: .2639rem; /* 38 */
                  }
                }
              }
              >button{
                -webkit-box-flex: 30; /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 30; /* OLD - Firefox 19- */
                // width: 20%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 30; /* Chrome */
                -ms-flex: 30;  /* IE 10 */
                flex: 30; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                border: 0 none;
                outline: none;
                width: 1.4375rem; /* 207 */
                height: .5764rem; /* 83 */
                line-height: .5764rem; /* 83 */
                font-size: .2639rem; /* 38 */
                letter-spacing: .0069rem; /* 1 */
                /* IE < 10 */
                background-image: -ms-linear-gradient(-90deg, #ff4c5a 0%, #ff8e51 100%);
                /* Opera 11.10+ */
                background-image: -o-linear-gradient(-90deg, #ff4c5a 0%, #ff8e51 100%);
                /* Firefox 3.6+ */
                background-image: -moz-linear-gradient(-90deg, #ff4c5a 0%, #ff8e51 100%);
                /* Webkit: Safari 5.1+, Chrome 10+ */
                background-image: -webkit-linear-linear-gradient(-90deg, #ff4c5a 0%, #ff8e51 100%);
                /* Webkit: Safari 4-5, Chrome 1-9 */
                background-image: -webkit-linear-gradient(-90deg, #ff4c5a 0%, #ff8e51 100%);
                background-image: linear-gradient(-90deg, #ff4c5a 0%, #ff8e51 100%);
                background-image: linear-gradient(-90deg, #ff4c5a 0%, #ff8e51 100%);
                border-radius: .2778rem; /* 40 */
                color: #ffffff;
              }
              button.finish{
                background: #b5b5b5;
              }
            }
          }
          li:nth-of-type(even){
            /* IE < 10 */
            background-image: -ms-linear-gradient(-90deg, rgba(255, 76, 90, 0.2) 0%, rgba(255, 142, 81, 0.2) 100%);
            /* Opera 11.10+ */
            background-image: -o-linear-gradient(-90deg, rgba(255, 76, 90, 0.2) 0%, rgba(255, 142, 81, 0.2) 100%);
            /* Firefox 3.6+ */
            background-image: -moz-linear-gradient(-90deg, rgba(255, 76, 90, 0.2) 0%, rgba(255, 142, 81, 0.2) 100%);
            /* Webkit: Safari 5.1+, Chrome 10+ */
            background-image: -webkit-linear-linear-gradient(-90deg, rgba(255, 76, 90, 0.2) 0%, rgba(255, 142, 81, 0.2) 100%);
            /* Webkit: Safari 4-5, Chrome 1-9 */
            background-image: -webkit-linear-gradient(-90deg, rgba(255, 76, 90, 0.2) 0%, rgba(255, 142, 81, 0.2) 100%);
            background-image: linear-gradient(-90deg, rgba(255, 76, 90, 0.2) 0%, rgba(255, 142, 81, 0.2) 100%);
          }
        }
      }
    }
  }
</style>

<template>
  <div class="Home_tab3" ref="tab3">
    <div class="container">
      <div class="receive-all">
        <div class="receive">
          <span><span>总积分:</span><i>{{allScore}}</i></span>
          <button @click="takePrize">我要兑奖</button>
        </div>
      </div>
      <div class="point">
        <ol>
          <li :class="{active : index == pointStatuIndex}" v-for="(item, index) in pointStatuList" :key="index" @click="changeStatu(index, '', true)">{{item.statu}}</li>
        </ol>
        <!-- 全部-获取-投注 -->
        <div class="point-record" @touchstart="scrollUp">
          <div class="wrapper" ref="scroll" :class="{noData : scoreList.length == 0}">
            <div class="content">
              <div v-if="pageIndex > 1" class="loading up">
                <i><img src="../../../static/images/loading_small.gif" alt=""></i>
              </div>
              <ul>
                <li v-for="(item, index) in scoreList" :key="index" :class="{ lose :  parseInt(item.occurpoints) < 0}" v-show="scoreList.length > 0">
                  <div>
                    <h3><span class="span">{{item.note | filterNote1}}</span> <br/> <span>{{occurdatetime(item.occurdatetime)}} {{item.note | filterNote2}}</span></h3>
                  </div>
                  <span class="points">{{parseInt(item.occurpoints) > 0 ? '+' + item.occurpoints : item.occurpoints}}积分</span>
                </li>
              </ul>
              <div v-if="scoreList.length === pageSize && isShowLoadingUp" class="loading down">
                <i><img src="../../../static/images/loading_small.gif" alt=""></i>
              </div>
            </div>
          </div>
          <p class="nodata" v-show="scoreList.length == 0">暂无数据</p>
        </div>
      </div>
    </div>
    <!-- 加载 -->
    <Loading v-if="mask.loading"></Loading>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Loading from '../common/Loading'
export default {
  name: 'Home_tab3',
  props: ['propData'],
  data () {
    return {
      pointStatuIndex: 0, // 积分状态默认下标
      pointStatuList: [ // 积分状态
        {
          statu: '全部'
        },
        {
          statu: '获取'
        },
        {
          statu: '投注'
        }
      ],
      allScore: 0, // 总积分
      scoreList: [], // 积分数据
      mask: {
        loading: false // 加载
      },
      pageIndex: 1, // 页码
      pageSize: 100, // 页面数据数，页面高度控制了8条数据
      isShowLoadingUp: true, // 是否可以上拉
      options: { // 上下拉加载更多数据
        pullDownRefresh: {
          threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: -50 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        // pullDownRefresh: false, // 关闭下拉
        // pullUpLoad: false, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0
        // eventPassthrough: 'vertical'
      }
    }
  },
  components: { // 公共组件
    Loading
  },
  filters: {
    /**
     * 切割数据中字符串1
     */
    filterNote1 (note) {
      let newNote = note.split('|')[0]
      return newNote
    },
    /**
     * 切割数据中字符串2
     */
    filterNote2 (note) {
      let newNote = note.split('|')[1]
      return newNote
    }
  },
  created: function () {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  mounted () {
    this.getData('', '') // 全部
  },
  methods: {
    /**
    * 切换积分状态
    */
    changeStatu: function (index, direction, isClick) {
      if (isClick === true) this.pageIndex = 1 // 切换时，pageIndex重新赋值
      this.pointStatuIndex = index
      if (index === 0) {
        this.getData(1, direction) // 为了解决文字重叠的bug
        setTimeout(() => {
          this.getData('', direction) // 全部
        }, 200)
      } else if (index === 1) {
        this.getData(1, direction) // 获取
      } else {
        this.getData(1, direction) // 为了解决文字重叠的bug
        setTimeout(() => {
          this.getData(2, direction) // 投注（消耗）
        }, 200)
      }
    },
    /**
     * 查询积分详情数据
     */
    getData (status, direction) {
      // console.info(this.propData.userinfo.xuid, this.pageSize, this.pageIndex, direction)
      if (this.propData.userinfo.xuid) {
        if (!direction) this.mask.loading = true // loading
        this.$ajax({
          url: '/scoreDetail',
          params: {
            xid: this.propData.userinfo.xuid,
            queryType: status,
            pageSize: this.pageSize,
            pageNo: this.pageIndex
          }
        }).then((res) => {
          console.info(res)
          var resData = res.data.respbody
          this.allScore = resData.score
          if (resData.list.length) { // 有数据就赋值
            this.scoreList = []
            this.scoreList = resData.list
            this.isShowLoadingUp = true
          } else { // 没有数据就不上拉了
            console.info(direction === '')
            if (direction === '') {
              this.scoreList = []
              // this.scoreList = resData.list
              this.isShowLoadingUp = true
            } else {
              this.isShowLoadingUp = false
            }
          }
          if (!direction) this.mask.loading = false // loading
          this.$nextTick(() => {
            this.pullingDownUp()
          })
        }).catch((error) => {
          console.info(error)
          if (!direction) this.mask.loading = false // loading
        })
      } else {
        // console.info('您没登录哦！')
      }
    },
    /**
     * 业务发生日期
     */
    occurdatetime: function (time) {
      return this.GLOBAL.changeTimeTypeElse(time)
    },
    /**
     * 我要兑奖
     */
    takePrize () {
      console.log('我要兑奖！')
      if (this.GLOBAL.getQueryString('inUlb')) {
        if (!this.propData.userinfo.isLogin) { // 在app中且未登录
          // 重新登陆
          this.cordova({
            reloginflag: '1',
            accounttype: '1'
          })
        } else {
          navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://estock.xyzq.com.cn/points/?goto_page=2'})
          // window.location.href = 'https://estock.xyzq.com.cn/points/?goto_page=2'
        }
      } else {
        console.info('您没登录优理宝哦！')
      }
    },
    /**
     * 点击向上滚动
     */
    scrollUp () {
      console.info('向上滚动！')
      this.$refs.tab3.scrollTop = 660
    },
    /**
     * 添加上下拉效果
     */
    _initScroll () {
      // 垂直滑动
      (() => {
        this.scroll = new BScroll(this.$refs.scroll, this.options)
        // 下拉
        this.scroll.on('pullingDown', () => {
          if (this.pageIndex) {
            console.info(this.pageIndex)
            if (this.pageIndex > 1) {
              this.pageIndex--
              this.changeStatu(this.pointStatuIndex, 'down', '')
            }
            // 刷新数据的过程中，回弹停留在距离顶部还有20px的位置
            // this.getData(true) // 获取数据方法
          }
        })
        // 上拉
        this.scroll.on('pullingUp', () => {
          if (this.scoreList.length === this.pageSize) { // 判断是否继续上拉刷新
            this.pageIndex++
            // this.getData(false)
            // this.setData() // 获取数据方法
            this.changeStatu(this.pointStatuIndex, 'up', '')
          }
        })
      })();
      // 水平滑动
      (() => {
        // this.scrollX = new BScroll(this.$refs.scrollX, {scrollX: true, probeType: 3})
        // 水平滑动的时候使顶部表头一起滑动
        // this.scrollX.on('scroll', (pos) => {
        // this.$refs.thead.style.transform = 'translateX(' + pos.x + 'px)'
        // })
      })()
    },
    /**
     * 滑动效果收尾
     */
    pullingDownUp () {
      this.scroll.finishPullDown()
      this.scroll.finishPullUp()
      this.scroll.refresh() // 重新计算元素高度
      this.scroll.scrollTo(0, 0, 500, 'easing')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .Home_tab3{
    .container{
      .receive-all{
        padding-top: 6.0764rem;
      }
      .receive{
        padding: 0 .2083rem; /* 30 */
        width: 6.3611rem; /* 975-60 */
        height: .8125rem; /* 117 */
        margin: 0 .3611rem 0 .3611rem; /* 52 */
        background: #fff3f3;
        -moz-box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
        -webkit-box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
        box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
        border-radius: .1389rem; /* 20 */
        line-height: .8125rem;
        display: box; /* OLD - Android 4.4- */
        display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
        display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
        display: -ms-flexbox; /* TWEENER - IE 10 */
        display: -webkit-flex; /* NEW - Chrome */
        display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
        /* 12版 */
        -webkit-justify-content: space-between;
        -moz-justify-content: space-between;
        -ms-justify-content: space-between;
        -o-justify-content: space-between;
        justify-content: space-between;
        /* 09版 */
        -webkit-box-align: center;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        -o-align-items: center;
        align-items: center;
        span{
          font-family: PingFangSC-Regular;
          font-size: .2917rem; /* 42 */
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: .0069rem; /* 1 */
          color: #d81c1d;
          display: box; /* OLD - Android 4.4- */
          display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
          display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
          display: -ms-flexbox; /* TWEENER - IE 10 */
          display: -webkit-flex; /* NEW - Chrome */
          display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
          /* 12版 */
          -webkit-justify-content: center;
          -moz-justify-content: center;
          -ms-justify-content: center;
          -o-justify-content: center;
          justify-content: center;
          /* 09版 */
          -webkit-box-align: center;
          /* 12版 */
          -webkit-align-items: center;
          -moz-align-items: center;
          -ms-align-items: center;
          -o-align-items: center;
          align-items: center;
          i{
            font-size: .4167rem; /* 60 */
            background-image: -webkit-linear-gradient(bottom, #ff4c5a,#ff8e51);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        button{
          border: 0 none;
          outline: none;
          width: 1.5069rem; /* 217 */
          height: .5069rem; /* 73 */
          border-radius: .25rem; /* 36 */
          /* IE < 10 */
          background-image: -ms-linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
          /* Opera 11.10+ */
          background-image: -o-linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
          /* Firefox 3.6+ */
          background-image: -moz-linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
          /* Webkit: Safari 5.1+, Chrome 10+ */
          background-image: -webkit-linear-linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
          /* Webkit: Safari 4-5, Chrome 1-9 */
          background-image: -webkit-linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
          background-image: linear-gradient(-99deg, #ff8e51 0%, #ff4c5a 100%);
          font-family: PingFangSC-Regular;
          font-size: .25rem; /* 36 */
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #ffffff;
        }
      }
      /* 积分-全部-获取-投注 */
      .point{
        margin-top: .2778rem; /* 40 */
        padding-bottom: .4167rem; /* 60 */
        ol{
          display: box; /* OLD - Android 4.4- */
          display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
          display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
          display: -ms-flexbox; /* TWEENER - IE 10 */
          display: -webkit-flex; /* NEW - Chrome */
          display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
          -webkit-box-pack: center;
          /* 12版 */
          -webkit-justify-content: center;
          -moz-justify-content: center;
          -ms-justify-content: center;
          -o-justify-content: center;
          justify-content: center;
          li{
            width: 1.9444rem; /* 280 */
            height: .6736rem; /* 97 */
            line-height: .6736rem;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: .3194rem; /* 46 */
            letter-spacing: 0px;
            color: #fff0e5;
            font-weight: normal;
            font-stretch: normal;
            /* IE < 10 */
            background-image: -ms-linear-gradient(0deg, #fc453f 1%, #fe8d2d 100%);
            /* Opera 11.10+ */
            background-image: -o-linear-gradient(0deg, #fc453f 1%, #fe8d2d 100%);
            /* Firefox 3.6+ */
            background-image: -moz-linear-gradient(0deg, #fc453f 1%, #fe8d2d 100%);
            /* Webkit: Safari 5.1+, Chrome 10+ */
            background-image: -webkit-linear-linear-gradient(0deg, #fc453f 1%, #fe8d2d 100%);
            /* Webkit: Safari 4-5, Chrome 1-9 */
            background-image: -webkit-linear-gradient(0deg, #fc453f 1%, #fe8d2d 100%);
            background-image: linear-gradient(-90deg, #ff8b52 0%, #ff4f59 100%);
            -moz-box-shadow: -.0278rem .0139rem .1389rem 0px rgba(77, 22, 0, 0.2); /* 4 2 20 */
            -webkit-box-shadow: -.0278rem .0139rem .1389rem 0px rgba(77, 22, 0, 0.2); /* 4 2 20 */
            box-shadow: -.0278rem .0139rem .1389rem 0px rgba(77, 22, 0, 0.2); /* 4 2 20 */
            border-radius: .1389rem .1389rem 0 0; /* 20 */
          }
          li.active{
            background: #fff2f2;
            color: #e94d2f;
          }
        }
        .point-record{
          box-sizing: border-box;
          position: relative;
          width: 6.7708rem; /* 975 */
          // height: 8.6111rem; /* 1240 */
          margin: 0 .3611rem 0 .3611rem; /* 52 */
          background: #fff3f3;
          border-radius: .1389rem; /* 20 */
          -moz-box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
          -webkit-box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
          box-shadow: 0px .0694rem .2083rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
          .wrapper{
            height: 8.6111rem; /* 155*8=1240 */
            overflow: hidden;
            .content{
              min-height: 8.6806rem; /* 1250* */
              position: relative;
              .loading{
                height: 1rem;
                position: absolute;
                width: 100%;
                i{
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  width: .32rem;
                  height: .32rem;
                  margin-top: -.16rem;
                  margin-left: -.16rem;
                }
                &.up{
                  top: -1rem
                }
                &.down{
                  bottom: -1rem
                }
              }
              ul{
                li{
                  display: box; /* OLD - Android 4.4- */
                  display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
                  display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
                  display: -ms-flexbox; /* TWEENER - IE 10 */
                  display: -webkit-flex; /* NEW - Chrome */
                  display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                  -webkit-box-pack: space-between;
                  /* 12版 */
                  -webkit-justify-content: space-between;
                  -moz-justify-content: space-between;
                  -ms-justify-content: space-between;
                  -o-justify-content: space-between;
                  justify-content: space-between;
                  /* 09版 */
                  -webkit-box-align: center;
                  /* 12版 */
                  -webkit-align-items: center;
                  -moz-align-items: center;
                  -ms-align-items: center;
                  -o-align-items: center;
                  align-items: center;
                  min-height: 1.0764rem; /* 155 */
                  font-family: PingFangSC-Regular;
                  font-weight: normal;
                  font-stretch: normal;
                  color: #d81c1d;
                  div{
                    -webkit-box-flex: 70; /* OLD - iOS 6-, Safari 3.1-6 */
                    -moz-box-flex: 70; /* OLD - Firefox 19- */
                    // width: 20%; /* For old syntax, otherwise collapses. */
                    -webkit-flex: 70; /* Chrome */
                    -ms-flex: 70;  /* IE 10 */
                    flex: 70; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                    padding: .1389rem 0; /* 20 */
                    padding-left: .1528rem; /* 22 */
                    // display: box; /* OLD - Android 4.4- */
                    // display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
                    // display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
                    // display: -ms-flexbox; /* TWEENER - IE 10 */
                    // display: -webkit-flex; /* NEW - Chrome */
                    // display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                    // -webkit-flex-direction: column;
                    // -moz-flex-direction: column;
                    // -ms-flex-direction: column;
                    // -o-flex-direction: column;
                    // flex-direction: column;
                    h3{
                      padding-left: .1389rem; /* 20 */
                      // line-height: .3125rem; /* 45 */
                      // letter-spacing: .0069rem; /* 1 */
                      span{
                        font-size: .25rem; /* 36 */
                        margin: 0;
                        &.span{
                          font-size: .2917rem; /* 42 */
                          margin: 0;
                        }
                      }
                    }
                  }
                  span.points{
                    -webkit-box-flex: 30; /* OLD - iOS 6-, Safari 3.1-6 */
                    -moz-box-flex: 30; /* OLD - Firefox 19- */
                    // width: 20%; /* For old syntax, otherwise collapses. */
                    -webkit-flex: 30; /* Chrome */
                    -ms-flex: 30;  /* IE 10 */
                    flex: 30; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                    margin-right: .2917rem; /* 42 */
                    font-size: .3333rem; /* 48 */
                    text-align: right;
                    background-image: -webkit-linear-gradient(bottom,#ff4c5a,#ff8e51);
                    /* background-image: -o-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
                    /* background-image: -moz-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
                    /* background-image: linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                }
                li:nth-of-type(even){
                  background-image: linear-gradient(-90deg, rgba(255, 76, 90, 0.2) 0%, rgba(255, 142, 81, 0.2) 100%);
                }
                li.lose{
                  color: #2f4af0;
                  div,span{
                    background-image: -webkit-linear-gradient(bottom,#2f4af0,#4fa8ff);
                    /* background-image: -o-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
                    /* background-image: -moz-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
                    /* background-image: linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                }
              }
            }
          }
          .wrapper.noData{
            height: 3.2292rem; /* 155*3=465 */
          }
          .nodata{
            position: absolute;
            top: 50%;
            left: 50%;
            height: .4167rem; /* 60 */
            width: 1.3889rem; /* 200 */
            margin-left: -.6944rem;
            margin-top: -.2083rem;
            font-size: 0.3194rem;
            color: #555;
            text-align: center;
          }
        }
      }
    }
  }
</style>

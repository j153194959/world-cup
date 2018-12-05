<template>
  <div class="Activity1" ref="activity1">
    <div>
      <header>
        <img src="../../assets/vote_block1_rule.png" alt="">
      </header>
      <main>
        <div class="content_container">
          <ul class="clearfix">
            <li v-for="(value, index) in teamList" :key="index" >
              <div class="liList">
                  <img class="left_num"  :src="'static/images/vote_num'+(index+1)+'.png'" alt="">
                  <div class="center">
                    <div><img class="flag" :src="'./static/images/'+value.img" alt=""><span>{{value.player}}</span></div>
                    <p>人气：<span>{{value.percent}}%</span></p>
                    <div class="progress_bar"><span class="support_rate" :style="{'width': value.percent + '%'}"></span></div>
                  </div>
                  <div :class="['vote_fz', getClass(value.status)]" @click="clickVote(index, value.status, value.id)" v-cloak>{{value.status === 1 ? '已投票' : '投票'}}</div>
              </div>
            </li>
            <!-- <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num02.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num02.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                <div class="progress_bar"><span class="support_rate"></span></div>
                </div>
                <div class="right_voteBtn2 vote_fz">投票</div>
              </div>
            </li>
            <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num03.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num03.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                  <div class="progress_bar"><span class="support_rate"></span></div>
                  </div>
                <div class="right_voteBtn3 vote_fz">投票</div>
              </div>
            </li>
            <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num04.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num04.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                <div class="progress_bar"><span class="support_rate"></span></div>
                </div>
                <div class="right_voteBtn2 vote_fz">投票</div>
              </div>
            </li>
            <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num05.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num05.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                <div class="progress_bar"><span class="support_rate"></span></div>
                </div>
                <div class="right_voteBtn2 vote_fz">投票</div>
              </div>
            </li>
            <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num06.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num06.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                <div class="progress_bar"><span class="support_rate"></span></div>
                </div>
                <div class="right_voteBtn2 vote_fz">投票</div>
              </div>
            </li>
            <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num06.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num06.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                <div class="progress_bar"><span class="support_rate"></span></div>
                </div>
                <div class="right_voteBtn2 vote_fz">投票</div>
              </div>
            </li>
            <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num06.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num06.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                <div class="progress_bar"><span class="support_rate"></span></div>
                </div>
                <div class="right_voteBtn2 vote_fz">投票</div>
              </div>
            </li>
            <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num06.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num06.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                <div class="progress_bar"><span class="support_rate"></span></div>
                </div>
                <div class="right_voteBtn2 vote_fz">投票</div>
              </div>
            </li>
            <li>
              <div class="liList">
                <img class="left_num" src="../../assets/vote_num06.png" alt="">
                <div class="center">
                  <div><img class="flag" src="../../assets/vote_flag_num06.png" alt=""><span>内马尔</span></div>
                  <p>人气：<span>86%</span></p>
                <div class="progress_bar"><span class="support_rate"></span></div>
                </div>
                <div class="right_voteBtn2 vote_fz">投票</div>
              </div>
            </li> -->
          </ul>
        </div>
      </main>
      <!-- 获得积分投票 -->
      <transition name="fade">
        <div class="mask" v-if="getPoints">
          <div class="pop_bg">
            <div>
              <img src="../../assets/vote_pop_img.png" alt="">
              <p>恭喜你获得200积分</p>
              <p>快去竞猜吧！</p>
              <a href="javascript:void(0)" @click="closeMask">好的</a>
            </div>
            <a class="maskTwo"  @click="closeMask" href="javascript:void(0)"><img src="../../assets/ico_close.png" alt=""></a>
          </div>
        </div>
      </transition>
      <!-- 加载 -->
      <Loading v-if="mask.loading"></Loading>
    </div>
  </div>
</template>

<script>
import Loading from '../common/Loading'

export default {
  props: ['propData'], // 接收父组件值
  name: 'Activity1',
  data () {
    return {
      getPoints: false, // 获得积分弹窗
      status: 0, // 默认可以投票
      // canclick: true,
      // id: '', // 被投票人员id
      // src: [ // 标号
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png'},
      //   {'static/images/vote_flag_num02.png}'
      // ],
      teamList: [ // 投票小组列表
        // {
        //   country: '巴西',
        //   player: '内马尔',
        //   img: 'ico_Brazil.png',
        //   percent: 60,
        //   status: 0 // 状态(0-可投票;1-已投票;2-不可投票)
        // },
        // {
        //   country: '巴西',
        //   player: '梅西',
        //   img: 'ico_Brazil.png',
        //   percent: 30,
        //   status: 0
        // },
        // {
        //   country: '巴西',
        //   player: 'C罗',
        //   img: 'ico_Brazil.png',
        //   percent: 60,
        //   status: 0
        // }
      ],
      mask: { // 弹窗控制
        loading: false // 加载
      }
    }
  },
  components: { // 公共组件
    Loading
  },
  methods: {
    // 点击投票
    clickVote: function (index, status, id) {
      // this.$refs.activity1.style.overflowY = 'hidden'
      // this.getPoints = true
      // 优理宝App_世界杯_足球先生_投票埋点
      window.TDAPP.onEvent('ylb_WC_Mister_Vote', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      if (status) return
      if (this.propData.userinfo.xuid) {
        this.mask.loading = true
        this.$ajax({
          url: '/playerGuessing',
          params: {
            id: id,
            xid: this.propData.userinfo.xuid,
            Token: this.propData.userinfo.Token,
            client: this.propData.userinfo.Client
          }
        }).then((res) => {
          console.log(res.data)
          // alert(JSON.stringify(res.data))
          const data = res.data.resphead
          if (data.respcode === '0000') {
            // this.$refs.activity1.style.overflowY = 'hidden'
            this.getPoints = true
            this.status = data.status
            for (let i = 0; i < this.teamList.length; i++) {
              this.teamList[i].status = 2
            }
            this.teamList[index].status = 1
          }
          this.mask.loading = false
        }).catch((err) => {
          console.log(err)
          // alert(JSON.stringify(err))
          this.mask.loading = false
        })
      }
    },
    // 关闭弹窗
    closeMask: function () {
      // this.$refs.activity1.style.overflowY = 'scroll'
      this.getPoints = false
    },
    dataLoad: function (index, status, id) {
      this.mask.loading = true
      this.$ajax({
        url: '/playerList',
        params: {xid: this.propData.userinfo.xuid}
      }).then((res) => {
        const data = res.data.respbody
        // console.log(data)
        this.teamList = data
        this.status = data[0].status
        this.mask.loading = false
      }).catch((err) => {
        console.log(err)
        this.mask.loading = false
      })
    },
    getClass: function (statu) {
      var arr = ['right_voteBtn', 'right_voteBtn2', 'right_voteBtn3']
      return arr[statu]
    }
  },
  mounted: function () {
    this.dataLoad()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Activity1{
  [v-cloak] {
  display:none !important;
    }
  > div{
    background: url(../../assets/vote_bg.png) no-repeat left top;
    background-size: cover;
    height: auto!important;
    /* 头部banner */
    header{
      padding-top: 5.5556rem; /* 800 */
    }
    /* 主体部分 */
    main{
      /* top: 8.0347rem; 1157 */
      width: 100%;
      padding: 0.2514rem 0 1.4514rem 0; /* 209 */
      .content_container{
        ul{
          li{
            display: flex;
            width: 7.0833rem; /* 1020 */
            height: 1.7361rem; /* 250 */
            background-color: #ffffff;
            border-radius: 0.15rem;
            margin: .138889rem auto; /* 20 */
            box-shadow: 0px 0px 20px #fcbb67 inset;
            .liList{
              font-family: PingFangSC-Regular;
              display: flex;
              display:-webkit-box;
              display: -moz-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              flex: 1;
              .left_num{
              width: 0.75rem; /* 108 */
              height: 0.7153rem; /* 103 */
              flex: 0.15;
              margin: 0.5625rem 0 0 0.3472rem; /* 81 0 0 50 */
              }
              .center{
                flex:0.8;
                margin: 0.3819rem 0 0 0.2847rem; /* 55 0 0 41 */
                div{
                  position: relative;
                  .flag{
                  width: 0.6944rem; /* 100 */
                  height: 0.3472rem; /* 50 */
                  }
                  span{
                    position: absolute;
                    top: 0;
                    left: 0.875rem; /* 126 */
                    font-size: 0.375rem; /* 54 */
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 0.3819rem; /* 55 */
                    letter-spacing: 0px;
                    color: #353535;
                  }
                }
                /* 支持率文字 */
                p{
                  font-size: 0.25rem; /* 36 */
                  font-weight: normal;
                  font-stretch: normal;
                  line-height: 0.3819rem; /* 55 */
                  letter-spacing: 0px;
                  color: #808080;
                  margin-top: 0.1736rem; /* 25 */
                }
                /* 进度条 */
                .progress_bar{
                    width: 3.3333rem; /* 480 */
                    height: .111111rem; /* 16 */
                    display: block;
                    background-color: #ebebeb;
                    border-radius: 1rem;
                    margin-top: 0.1389rem; /* 20 */
                  .support_rate{
                    width: 1.4542rem;
                    height: .118056rem; /* 17 */
                    display: block;
                    border-radius: 1rem;
                    position: absolute;
                    background-image: linear-gradient(90deg, #fac934 0%, #f5540c 100%);
                    /* background: -webkit-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240));*/
                    left: 0;
                    top: 0;
                    }
                  }
                }
              /* 投票 */
              .vote_fz{
                width: 1.6667rem; /* 240 */
                height: 0.625rem; /* 90 */
                line-height: 0.625rem; /* 90 */
                color: #fff;
                font-family: 'PingFangSC-Regular';
                font-size: 0.3333rem; /* 48 */
                text-align: center;
                border-radius: 0.3rem;
                margin-top: 0.5556rem; /* 80 */
                margin-right: 0.05rem;
              }
              .right_voteBtn{
                /* flex:0.2; */
                background-color: #f42f15;
                box-shadow: 0px 8px 25px 0px rgba(205, 25, 2, 0.25),inset -6px -10px 40px 0px rgba(160, 23, 4, 0.3);

              }
              /* 已投票 */
              .right_voteBtn2{
                background-color: #fad2cd;
              }
              /* 投票灰*/
              .right_voteBtn3{
                background-color: #e0e0e0;
              }
            }
          }
        }
      }
    }
    /* 弹窗部分 */
    .mask{
      position: fixed;
      z-index: 10;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.7);
      top: 0;
      left: 0;
      display:-webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
      .pop_bg{
        background:url(../../assets/vote_pop_bg.png) no-repeat center top;
        width: 5.7083rem; /* 822 */
        height :6.4931rem; /* 935 */
        background-size: 100% 100%;
        position: relative;
        > div{
          img{
            width: 2.5rem; /* 360 */
            height: 2.5rem;
            margin: 0 auto;
            padding-top: 1.125rem; /* 162 */
          }
          p{
            text-align: center;
            line-height: .472222rem; /* 68 */
          }
          p:nth-of-type(1){
            width: 472px;
            font-family: PingFangSC-Medium;
            font-size: 0.375rem; /* 54 */
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #e5a407;
            width: 100%;
            margin-top:0.1389rem; /* 20 */
          }
          p:nth-of-type(2){
            font-size: 0.2917rem; /* 42 */
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #999999;
            font-family: PingFangSC-Regular;
          }
          a{
            text-align: center;
            display: block;
            width: 3.75rem; /* 540 */
            height: 0.7639rem; /* 110 */
            line-height: 0.7639rem; /* 110 */;
            background-color: #f42f15;
            box-shadow: 0px 8px 25px 0px rgba(205, 25, 2, 0.25),inset -6px -10px 45px 0px rgba(160, 23, 4, 0.4);
            border-radius: 55px; /* 55 */
            margin: 0 auto;
            font-size: 0.375rem; /* 54 */
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #ffffff;
            margin-top : 0.2819rem;
          }
        }
        .maskTwo{
          width: .7917rem; /* 114 */
          height: .7917rem; /* 114 */
          position: absolute;
          left: 50%;
          bottom: -.791667rem; /* 114 */
          transform: translateX(-50%);
          -webkit-transform: translateX(-50%); /* for Chrome || Safari */
          -moz-transform: translateX(-50%); /* for Firefox */
          -ms-transform: translateX(-50%); /* for IE */
          -o-transform: translateX(-50%);
          // bottom: 5.0431rem;
        }
      }
    }
  }
}
</style>

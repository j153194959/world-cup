<template>
  <div class="Activity2" ref="activity2">
    <div>
      <img class="xyLogo" src="../../assets/ico_logo.png" alt="">
      <header>
        <img class="banner" src="../../assets/ico_Main vision.png" alt="">
      </header>
      <main>
        <div class="rule-one" :class="{allReg : showmoreRegular}">
          <h3>活动规则</h3>
          <div class="rule-word">
            <p><b>1.</b>竞猜冠军球队瓜分1亿积分:即日起至6月24日23:59，竞猜世界杯足球最终冠军；</p>
            <p :class="{ellipsis:!showmoreRegular}"><b>2.</b>可选择1-32支队伍，每支队伍消耗200积分;</p>
          </div>
          <div class="rule-word-all" v-show="showmoreRegular">
            <p><b>3.</b>猜中最终冠军归属即可与所有竞猜成功的用户瓜分一亿积分。例：竞猜巴西夺冠，消耗200积分，共有10,000人猜对，每人可获得1,000,000积分;</p>
            <p><b>4.</b>不可修改竞猜结果；</p>
            <p><b>5.</b>支持多次竞猜；</p>
            <p><b>6.</b>更多竞猜规则详见活动页。</p>
          </div>
          <a @click="showmoreReg" :class="{arrowdown : showmoreRegular}" href="javascript:void(0)"></a>
        </div>
        <div class="rule-two">
          <img class="lianhuan" src="../../assets/ico_lianjie.png" alt="">
          <div class="group-list">
            <ul>
              <li :class="{'active':group == curGroup}" v-for="(curGroup, index) in groupList" @click="changeGroup(curGroup, index)" :key="index"><span>{{curGroup}}组</span></li>
            </ul>
          </div>
          <!-- 支持率 -->
          <div class="game-team clearfix">
            <ul>
              <li class="clearfix" v-if="i >= index * 4 && i < (index + 1) * 4" v-for="(item,i) in tempData" :key="i">
                <div class="liOne" :class="{liOneadd: item.selected}" @click="selectItem(i)"></div>
                <div class="liTwo"><img class="flag" :src="'./static/images/'+item.img" alt=""></div>
                <div class="liThree"><b>{{item.country}}</b><br><span>支持率</span>
                  <p class="progress_bar"><span class="support_rate" :style="{'width': item.percent + '%'}"></span></p>
                </div>
                <div class="liFour">{{item.percent}}%</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer_bg"><img src="../../assets/icon_decorate.png" alt=""></div>
      </main>
      <footer>
          <div class="footer_left"><span class="des_word">投注积分：</span><span class="need_score">{{score}}</span></div>
          <div :class="['footer_right', !score ? 'gray' : '']" @click="clickGuess" v-cloak>竞猜</div>
      </footer>
      <!-- 竞猜成功弹框 -->
      <transition name="fade">
        <dicyv class="mask" v-if="sucessMask">
          <div class="mask_bg">
            <div class="mask_word">
              <p>竞猜成功</p>
              <p>期待他们不负众望~</p>
            </div>
            <a class="maskOne" @click="closesucessMask" href="javascript:void(0)"><img src="../../assets/ico_close.png" alt=""></a>
          </div>
        </dicyv>
      </transition>
      <!-- 竞猜积分不足弹框  -->
      <transition name="fade">
        <div class="mask" v-if="failMask">
          <div class="mask_bgTwo">
            <div class="mask_word">
              <p>积分不足呦~</p>
              <p>立即前往</p>
              <p>"我的大力神杯"</p>
              <p>做任务赢积分</p>
            </div>
            <a class="btn" @click="gotab" href="javascript:void(0)">好的</a>
            <a class="maskTwo" @click="failMask = false" href="javascript:void(0)"><img src="../../assets/ico_close.png" alt=""></a>
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
  name: 'Activity2',
  data () {
    return {
      showmoreRegular: false, // 不展示剩余规则
      sucessMask: false, // 竞猜成功弹窗
      failMask: false, // 积分不足弹窗
      chooseNum: '', // 选择支持的队伍个数
      teamsid: [],
      groupList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], // 组列表
      group: 'A', // 分组
      index: 0,
      perScore: 200, // 选择每个队伍所用积分
      tempData: [], // 修改后的全部球队数据
      // groupshowList: [ // 队伍列表
      //   {
      //     id: '20180525111734',
      //     country: '冰岛',
      //     group: 'A',
      //     img: '',
      //     percent: 8,
      //     status: 0
      //   }
      // ]
      mask: { // 弹窗控制
        loading: false // 加载
      }
    }
  },
  components: { // 公共组件
    Loading
  },
  methods: {
    //  规则完整显示
    showmoreReg: function () {
      this.showmoreRegular = !this.showmoreRegular
    },
    // 关闭弹窗
    closesucessMask: function () {
      this.$refs.activity2.style.overflowY = 'scroll'
      this.sucessMask = false
      this.failMask = false
    },
    // 竞猜积分不足跳
    gotab: function () {
      this.$router.push({name: 'tab2'})
    },
    // 点击竞猜
    clickGuess: function () {
      // 优理宝ylb_世界杯_冠军盘_竞猜埋点
      window.TDAPP.onEvent('ylb_WC_Champion_Guess', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      var idArr = []
      for (let i = 0; i < this.tempData.length; i++) {
        if (this.tempData[i].selected && !this.tempData[i].status) {
          idArr.push(this.tempData[i].id)
        }
      }
      console.log(idArr)
      if (idArr.length) {
        this.mask.loading = true
        this.$ajax({
          url: '/championGuessing',
          params: {
            list: idArr + '',
            xid: this.propData.userinfo.xuid,
            Token: this.propData.userinfo.Token,
            client: this.propData.userinfo.Client
          }
        }).then((res) => {
          console.log(res.data)
          if (res.data.resphead.respcode === '0000') {
            // this.$refs.activity2.style.overflowY = 'hidden'
            this.sucessMask = true
            // 成功之后数据处理
            for (let i = 0; i < this.tempData.length; i++) {
              if (this.tempData[i].selected && !this.tempData[i].status) {
                var item = this.tempData[i]
                item.status = 1
                this.$set(this.tempData, i, item)
              }
            }
          } else if (res.data.resphead.respcode === '1003') {
            // this.$refs.activity2.style.overflowY = 'hidden'
            this.failMask = true // 积分不足
          }
          this.mask.loading = false
        }).catch((erro) => {
          console.log(erro)
          this.mask.loading = false
        })
      }
    },
    // 点击切换组
    changeGroup: function (type, index) {
      this.group = type
      this.index = index
    },
    // 选择队伍支持
    selectItem: function (index) {
      if (this.tempData[index].status) return
      console.log(index)
      var item = this.tempData[index]
      item.selected = !item.selected
      // this.tempData[index].selected = true
      this.$set(this.tempData, index, item)
    },
    // 页面数据加载
    dataLoad: function (index, group, id) {
      this.mask.loading = true
      this.$ajax({
        url: '/countryList',
        params: {xid: this.propData.userinfo.xuid}
      }).then((res) => {
        const data = res.data.respbody
        console.log(res.data)
        this.tempData = data
        // console.log(this.tempData)
        if (res.data.resphead.respcode === '0000') {
          if (data.length > 0) {
            let temp = data
            temp.forEach((value) => {
              if (value.status) {
                value.selected = true
              } else {
                value.selected = false
              }
            })
            this.tempData = temp
          }
        }
        this.mask.loading = false
      }).catch((erro) => {
        this.mask.loading = false
      })
    }
  },
  mounted: function () {
    this.dataLoad()
  },
  // 计算投注积分
  computed: {
    // 每个渲染球队数据
    groupshowList () {
      let list = []
      this.tempData.forEach((value) => {
        if (value.group === this.group) {
          list.push(value)
        }
      })
      return list
    },
    // 当前组投注分
    score () {
      let selectedTeam = 0 // 选中队伍数初始化
      this.tempData.forEach((value) => {
        if (value.selected && !value.status) {
          selectedTeam++
        }
      })
      return selectedTeam * this.perScore
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Activity2 {
  [v-cloak] {
  display:none !important;
  }
  > div{
    background: url(../../assets/background.png);
    background-size: 100% 100%;
    height: auto!important;
    padding-top: 0.2708rem; /* 39px */
    .xyLogo {
      display: block;
      width: 2.4167rem; /* 348px */
      height: 0.5069rem; /* 73px */
      margin-left: 0.2153rem; /* 31px */
    }
    main{
      width: 100%;
      position: relative;
      top:-0.5625rem;
      .rule-one{
        background:url(../../assets/rules-one.png) no-repeat center center;
        background-size:100% 100%;
        width: 6.8889rem; /* 992px */
        height: 2.9028rem; /* 418px */
        margin: 0 auto;
        position: relative;
        h3{
          color: #7c369a;
          font-size: 0.375rem;
          font-family: "PingFangSC-Regular";
          font-weight: bold;
          text-align: center;
          padding-top: 0.1153rem;
        }
        .rule-word{
          width: 5.8333rem; /* 840 */
          padding: .236111rem .673611rem 0 .381944rem; /* 34 97 0 55 */
          font-size: .277778rem; /* 40 */
          color: rgb(106,68,144);
          line-height: .406667rem;
          b{
            font-family: "PingFangSC-Semibold";
            font-size: 0.25rem; /* 36 */
            }
          p.ellipsis{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        /* 全部规则 */
        .rule-word-all{
          width: 5.8333rem; /* 840 */
          padding: 0 .673611rem .8125rem .381944rem; /* 34 97 117 55 */
          font-size: .277778rem; /* 40 */
          color: rgb(106,68,144);
          line-height: .406667rem;
        }
        /* 箭头 */
        a{
            background: url(../../assets/ico_down2.png) center center no-repeat;
            display: block;
            width: 0.5556rem; /* 80 */
            height: 0.4097rem; /* 59 */
            position: absolute;
            bottom: .4444rem; /* 64 */
            left: 50%;
            transform: translateX(-50%);
            -webkit-transform: translateX(-50%); /* for Chrome || Safari */
            -moz-transform: translateX(-50%); /* for Firefox */
            -ms-transform: translateX(-50%); /* for IE */
            -o-transform: translateX(-50%);
            background-size: 100% 100%;
            bottom: 0.1rem;
            &.arrowdown{
              transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            margin-left: -0.2083rem;
            position:absolute;
            z-index:10000;
            }
          }
        }
      .rule-one.allReg{
        background: url(../../assets/rules-two.png) no-repeat center center;
        background-size: 100% 100%;
        width: 6.8889rem; /* 992 */
        height: 5.4167rem; /* 780 */
      }
      .rule-two{
        background: url(../../assets/fra_choice.png);
        background-size: 100% 100%;
        width: 6.888889rem; /* 99 2*/
        height: 7.118056rem; /* 1025 */
        margin: .173611rem auto; /* 34 */
        position: relative;
        .lianhuan{
          display: block;
          width: 6.125rem; /* 882 */
          height: .791667rem; /* 114 */
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          -webkit-transform: translateX(-50%); /* for Chrome || Safari */
          -moz-transform: translateX(-50%); /* for Firefox */
          -ms-transform: translateX(-50%); /* for IE */
          -o-transform: translateX(-50%);
          top: -0.48rem;
        }
        .group-list{
          width: 6.305556rem; /* 908 */
          height: 1.256944rem; /* 181 */
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          -webkit-transform: translateX(-50%); /* for Chrome || Safari */
          -moz-transform: translateX(-50%); /* for Firefox */
          -ms-transform: translateX(-50%); /* for IE */
          -o-transform: translateX(-50%);
          top: 0.3472rem;/*50*/
          li.active{
              background: -webkit-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240));
              span{
                background-image: -webkit-linear-gradient(bottom, #FFF, #FFF, #FFF);
              }
            }
          li{
            width: 1.4931rem; /* 215 */
            height: 0.5417rem; /* 78 */
            line-height: 0.5417rem;
            background-color: #fff;
            border-radius: 1rem;
            float: left;
            text-align: center;
            font-family: "PingFangSC-Regular";
            font-size: .277778rem;/*40px*/
            margin: .173611rem 0 0 0.07rem;
            /* background-image: -webkit-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
            /* background-image: -o-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
            /* background-image: -moz-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
            /* background-image: linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
            /* -webkit-background-clip: text; */
            /* -webkit-text-fill-color: transparent; */
          span{
            background-image: -webkit-linear-gradient(bottom,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240));
            /* background-image: -o-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
            /* background-image: -moz-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
            /* background-image: linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
            }
          }
        }
      .game-team{
        width: 100%;
        position: absolute;
        top: 2.0486rem;/*295*/
        ul{
          // padding: .3125rem 0 0 0; /* 45 */
          li{
          margin: .381944rem 0 0; /* 55 */
            div{
              float: left;
              /* margin: 0 0 0 0.1875rem;0 0 0 27 */
              color: rgb(124,54,154);
          .circle-choice{
              display: block;
              width: .361111rem; /* 52 */
              height: .361111rem;
            }
          .flag{
            display: block;
            width: 1.0625rem; /* 153 */
            height: .736111rem; /* 106 */
              }
            }
          }
          .liOne{
            display: block;
            margin: 0.1875rem 0 0 0.3819rem; /* 27 0 0 55 */
            display: block;
            background: url(../../assets/ico_UNchoice.png) no-repeat;
            background-size: 100% 100%;
            width: 0.3611rem; /* 52 */
            height: 0.3611rem; /* 52 */
            }
            //选择后的按钮
          .liOneadd{
            margin: 0.1875rem 0 0 0.3819rem; /* 27 0 0 55 */
            display:block;
            background: url(../../assets/icon_Choice.png) no-repeat;
            background-size: 100% 100%;
            width: 0.3611rem; /* 52 */
            height: 0.3611rem; /* 52 */
          }
          .liTwo{
            margin-left: 0.1667rem; /* 24 */
            }
          .liThree{
            margin-left: 0.1597rem;
            line-height: 0.25rem;
            .progress_bar{
              width:2.9444rem; /* 424 */
              height:.118056rem; /* 17 */
              display: block;
              background-color: #fff;
              border-radius:1rem;
              margin: -0.4rem 0 0 .847222rem;
              .support_rate{
                width: 1.4542rem;
                height: .118056rem; /* 17 */
                display: block;
                border-radius: 1rem;
                // position: absolute;
                background: -webkit-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240));
                }
              }
            b{
              font-size: 0.3125rem;
              font-family: 'PingFangSC-Regular';
              }
            span{
              font-size: 0.2569rem;
              line-height: 0.7431rem;
              }
            }
          .liFour{
              margin: 0.4208rem 0 0 0.0694rem; /* 0 0 13 */
              font-size: .256944rem; /* 3 7*/
            }
          }
        }
      }
      .footer_bg{
        width: 1.7847rem;
        height: 1.0486rem;
        margin-top: -0.5rem;
      }
    }
    footer{
      position: absolute;
      height: 1rem;
      background-color: #fff;
      margin-top: -0.6rem;
      line-height: 1rem;
      font-family:"PingFangSC-Regular";
    .footer_left{
      width:4.7778rem; /* 688 */
      float: left;
      font-size: 0.2778rem;
      .des_word{
        font-size: .319444rem;
        margin-left: 0.2847rem;
        color: rgb(124,54,154);
        }
      .need_score{
        background-image: -webkit-linear-gradient(bottom,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240));
        /* background-image: -o-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
        /* background-image: -moz-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
        /* background-image: linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        }
      }
      .footer_right{
        width: 2.7222rem; /* 392 */
        float: right;
        font-size: .388889rem;
        color: #fff;
        text-align: center;
        background: -webkit-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240));
        /* background:-o-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
        /* background:-moz-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
        /* background: linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
        &.gray{
          background: #cdcdcd;
        }
      }
    }
    /* 弹窗part */
    .mask{
      position: fixed;
      z-index: 10;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.5);
      top: 0;
      left: 0;
      .mask_bg{
        background: url(../../assets/success_pop.png) no-repeat center center;
        background-size: 100% 100%;
        width:5.6944rem; /* 820 */
        height:3.5764rem; /* 515 */
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%); /* for Chrome || Safari */
        -moz-transform: translateX(-50%); /* for Firefox */
        -ms-transform: translateX(-50%); /* for IE */
        -o-transform: translateX(-50%);
        top:50%;
        margin-top:-1.7847rem; /* 257 */
        .mask_word{
          position: absolute;
          top:1.9792rem;/*285*/
          width: 100%;
          left:50%;
          -webkit-transform: translateX(-50%); /* for Chrome || Safari */
          -moz-transform: translateX(-50%); /* for Firefox */
          -ms-transform: translateX(-50%); /* for IE */
          -o-transform: translateX(-50%);
          font-family:'PingFangSC-Regular';
          color:#fff;
          p:nth-of-type(1){
            font-size: 0.4444rem; /* 64 */
            text-align: center;
          }
          p:nth-of-type(2){
            font-size: 0.375rem; /* 54 */
            text-align: center;
          }
        }
      }
      .mask_bgTwo{
        background: url(../../assets/fail_pop.png) no-repeat center center;
        background-size: 100% 100%;
        width: 5.6944rem; /* 820 */
        height: 5.375rem;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%); /* for Chrome || Safari */
        -moz-transform: translateX(-50%); /* for Firefox */
        -ms-transform: translateX(-50%); /* for IE */
        -o-transform: translateX(-50%);
        top:50%;
        margin-top:-2.6875rem; /* 387 */
        .mask_word{
          position: absolute;
          top:1.875rem; /* 270 */
          width: 100%;
          p{
          text-align: center;
          color: #fff;
          font-family:'PingFangSC-Regular';
        }
        p:nth-of-type(1){
          text-align: center;
          font-size: 0.4444rem; /* 64 */
        }
        p:nth-of-type(2){
          font-size: 0.3472rem; /* 50 */
        }
        p:nth-of-type(3){
          font-size: 0.3611rem; /* 52 */
          font-weight: bold;
        }
        p:nth-of-type(4){
          font-size: 0.3472rem; /* 50 */
            }
          }
        /* 按钮 */
        .btn{
          display: block;
          width: 2.7778rem; /* 400 */
          height: 0.6944rem; /* 100 */
          line-height: 0.6944rem;
          border-radius: 1rem;
          color: #fff;
          text-align: center;
          background:-webkit-linear-gradient(left,rgb(255,177,34), rgb(255,119,81),rgb(255,75,118));
          /* background:-o-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
          /* background:-moz-linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
          /* background: linear-gradient(left,rgb(79,168,255), rgb(135,109,248),rgb(192,47,240)); */
          margin-top: 2rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          -webkit-transform: translateX(-50%); /* for Chrome || Safari */
          -moz-transform: translateX(-50%); /* for Firefox */
          -ms-transform: translateX(-50%); /* for IE */
          -o-transform: translateX(-50%);
          bottom: .416667rem;/*60*/
          font-size: 0.3958rem; /* 57 */;
        }
        .maskTwo{
          display: block;
          width: .7917rem;
          height: .7917rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          -webkit-transform: translateX(-50%);
          -moz-transform: translateX(-50%);
          -ms-transform: translateX(-50%);
          -o-transform: translateX(-50%);
          bottom: -1.2rem;
        }
      }
      .maskOne{
        display: block;
        width: .7917rem; /* 114 */
        height: .7917rem; /* 114 */
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%); /* for Chrome || Safari */
        -moz-transform: translateX(-50%); /* for Firefox */
        -ms-transform: translateX(-50%); /* for IE */
        -o-transform: translateX(-50%);
        bottom: -1.2rem;
      }
    }

  }
}
</style>

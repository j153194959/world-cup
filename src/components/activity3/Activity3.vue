<template>
  <div class="Activity3" ref="activity3">
    <header>
      <img src="../../assets/ico_coin.png" alt="">
    </header>
    <section>
      <div class="tip" :class="{tip_down : showArrow}">
        <h3>活动规则</h3>
        <ol>
          <li>1.全场独赢盘：即日起至7月15日，竞猜每日单场球赛的"胜""负""平";</li>
          <li :class="{ellipsis : !showArrow}">2.球赛结果统计正常完场时间(即90分钟正赛+伤停补时),不统计加时和点球结果;</li>
        </ol>
        <ul v-show="showArrow">
          <li>3.可选择胜/负/平其中的一个结果,每次比赛开始即停止竞猜;</li>
          <li>4.猜中比赛结果即可获得对应赔率的投注倍数积分;</li>
          <li>5.不可修改竞猜结果;</li>
          <li>6.支持单场比赛竞猜多个结果;例:先竞猜6/15比赛乌拉圭获胜,消耗200积分,随后再次竞猜和局,消耗500积分。</li>
        </ul>
        <i @click="showMore" :class="{down : showArrow}"></i>
      </div>
      <nav>注：比赛竞猜时间均为GMT+8:00北京时间</nav>
      <div class="activity">
        <ol>
          <li :class="{active : index == guessStatuIndex}" v-for="(item, index) in guessStatuList" :key="index" @click="changeStatu(index)">{{item.statu}}</li>
        </ol>
        <!-- 正在竞猜 -->
        <div class="guessing" v-show="guessStatuIndex == 0">
          <ul>
            <li v-if="matchingList.length == 0" style="text-align: center; height: 3.5208rem; line-height: 3.5208rem; font-size: .3194rem;">暂无数据</li>
            <li v-for="(item, index) in matchingList" :key="index" v-else>
              <div class="team">
                <div>
                  <img :src="'./static/images/'+item.teama.img" alt="">
                  <span>{{item.teama.country}}</span>
                </div>
                <div>
                  <span>VS</span>
                  <span>{{begintime(item.begintime)}}</span>
                </div>
                <div>
                  <img  :src="'./static/images/'+item.teamb.img" alt="">
                  <span>{{item.teamb.country}}</span>
                </div>
              </div>
              <p class="clickOdds">点击赔率开始竞猜</p>
              <div class="odds">
                <div :class="{active : game.ac}" v-for="(game, idx) in item.gameStatus" :key="idx" @click.stop="showCover(index, idx, item)">
                  <p>{{game.statu}}</p>
                  <span>{{ getOdds(item, idx)}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 即将开始 -->
        <div class="guess-start" v-show="guessStatuIndex == 1">
          <ul>
            <li v-if="comeingMatchList.length == 0" style="text-align: center; height: 3.5208rem; line-height: 3.5208rem; font-size: .3194rem;">暂无数据</li>
            <li v-for="item in comeingMatchList" :key="item.id" v-else>
              <p>开启竞猜：{{beginGuesstime(item.begintime)}}</p>
              <div class="team">
                <div>
                  <img :src="'./static/images/'+item.teama.img" alt="">
                  <span>{{item.teama.country}}</span>
                </div>
                <div>
                  <span>VS</span>
                  <span>{{begintime(item.begintime)}}</span>
                </div>
                <div>
                  <img :src="'./static/images/'+item.teamb.img" alt="">
                  <span>{{item.teamb.country}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 比赛结束 -->
        <div class="guess-end" v-show="guessStatuIndex == 2">
          <ul>
            <li v-if="matchedList.length == 0" style="text-align: center; height: 3.5208rem; line-height: 3.5208rem; font-size: .3194rem;">暂无数据</li>
            <li v-for="item in matchedList" :key="item.id" v-else>
              <p>{{begintime(item.begintime)}}</p>
              <div class="team">
                <div>
                  <img :src="'./static/images/'+item.teama.img" alt="">
                  <span>{{item.teama.country}}</span>
                </div>
                <div>
                  <span>
                    <i>{{ item.goala !==null ? item.goala : '-' }}</i>
                    <i>{{ item.goalb !==null ? item.goalb : '-' }}</i>
                  </span>
                  <span>@{{ endOdss(item) }}</span>
                </div>
                <div>
                  <img :src="'./static/images/'+item.teamb.img" alt="">
                  <span>{{item.teamb.country}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <!-- 弹出层-确认竞猜 -->
    <transition name="fade">
      <div class="points" v-show="showHide">
        <div class="cover" @click="showHideMask"></div>
        <div class="choice-points">
          <p>拥有积分：<span>{{userScore}}</span></p>
          <nav>
            <div><span>投注积分：</span><input v-model="choicePoint" type="number" placeholder="请输入100的整数倍"></div>
            <ul>
              <li :class="{active : item.point == choicePoint}" v-for="(item, index) in pointList" :key="index" @click="pickPoint(item.point)">{{item.point}}</li>
            </ul>
            <p class="max-point">理论最高奖励积分：<span>{{ highestRewardScore }}</span></p>
          </nav>
          <button @click="submitGuess">确认竞猜</button>
        </div>
      </div>
    </transition>
    <!-- 弹出层-竞猜积分不足 -->
    <transition name="fade">
      <div class="points-fail" v-show="showPointFail">
        <div class="cover"></div>
        <div class="fail">
          <h3>积分不足哟~</h3>
          <div>
            <span>立即前往</span>
            <span>"我的大力神杯"</span>
            <span>做任务赢积分</span>
          </div>
          <button @click="goActivity4">好的</button>
          <i @click="closePointFail"></i>
        </div>
      </div>
    </transition>
    <!-- 弹出层-竞猜积分成功 -->
    <transition name="fade">
      <div class="points-success" v-show="showPointSuccess">
        <div class="cover"></div>
        <div class="success">
          <h3>竞猜成功</h3>
          <div>
            <span>一起拭目以待吧~</span>
          </div>
          <i @click="closePointSuccess"></i>
        </div>
      </div>
    </transition>
    <!-- 弹出层-竞猜积分输入不合法(不是100的整数倍) -->
    <transition name="fade">
      <div class="points-illegal" v-show="showPointIllegal">
        <div class="cover"></div>
        <div class="illegal">
          <h3>请输入100的整数倍哟~</h3>
          <i @click="showPointIllegalMask"></i>
        </div>
      </div>
    </transition>
    <!-- 弹出层-该场比赛已经停止竞猜! -->
    <transition name="fade">
      <div class="points-timeout" v-show="showPointTimeout">
        <div class="cover"></div>
        <div class="timeout">
          <h3>该场比赛已经停止竞猜!</h3>
          <i @click="showPointTimeoutMask"></i>
        </div>
      </div>
    </transition>
    <!-- 加载 -->
    <Loading v-if="mask.loading"></Loading>
  </div>
</template>

<script>
import Loading from '../common/Loading'
export default {
  props: ['propData'],
  name: 'Activity3',
  data () {
    return {
      // userInfo: this.propData, // 用户信息
      showArrow: false, // 默认不展示更多规则
      showHide: false, // 是否打开竞猜遮罩层
      showPointFail: false, // 积分不足弹出框
      showPointSuccess: false, // 积分成功弹出层
      showPointIllegal: false, // 积分输入不合法（参数错误）
      showPointTimeout: false, // 积分竞猜时间已过
      choiceOdds: 0, // 选中赔率
      guessStatuList: [ // 竞猜状态
        {
          statu: '正在竞猜'
        },
        {
          statu: '即将开始'
        },
        {
          statu: '比赛结束'
        }
      ],
      guessStatuIndex: 0, // 竞猜状态默认下标
      matchingList: [], // 正在竞猜数据
      comeingMatchList: [], // 即将开始数据
      matchedList: [], // 比赛结束数据
      matchedOdds: 0, // 比赛结束后的赔率
      pointList: [ // 可选积分列表
        {point: 100},
        {point: 200},
        {point: 300},
        {point: 500},
        {point: 800},
        {point: 1000},
        {point: 1500},
        {point: 2000}
      ],
      userScore: 0, // 用户积分
      choicePoint: 100, // 默认可选积分为pointList的1000
      highestRewardScore: 0, // 理论最高奖励积分
      guessObj: { // 确认竞猜数据
        guessid: '',
        teamId: ''
      },
      mask: {
        loading: false // 加载
      }
    }
  },
  watch: {
    choicePoint: function () {
      this.highestRewardScore = parseInt(this.choiceOdds * this.choicePoint) // 理论最高奖励积分 = 赔率 * 投注积分
    }
  },
  components: { // 公共组件
    Loading
  },
  mounted: function (params) {
    this.getData()
  },
  methods: {
    /**
     * 获取数据
     */
    getData: function () {
      this.mask.loading = true // loading
      this.$ajax({
        url: '/matchList',
        params: {
          xid: this.propData.userinfo.xuid,
          Client: this.propData.userinfo.Client,
          Token: this.propData.userinfo.Token
        }
      }).then((res) => {
        console.info(res)
        // console.info(this.userInfo)
        const resData = res.data.respbody
        if (resData.matchingList) {
          resData.matchingList.forEach(item => {
            item.gameStatus = [{statu: '胜', ac: 1}, {statu: '平', ac: 0}, {statu: '胜', ac: 0}]
          })
          this.matchingList = resData.matchingList
          console.info(this.matchingList)
        }
        this.comeingMatchList = resData.comeingMatchList
        this.matchedList = resData.matchedList
        this.userScore = resData.score
        this.mask.loading = false // loading
      }).catch((error) => {
        console.info(error)
        this.mask.loading = false // loading
      })
    },
    /**
     * 比赛开始时间
     */
    begintime: function (time) {
      return this.GLOBAL.changeTimeType(time)
    },
    /**
     * 开始竞猜时间
     */
    beginGuesstime: function (time) {
      var mins = time - 24 * 60 * 60 * 1000 * 2
      return this.GLOBAL.changeTimeType(mins)
    },
    /**
    * 展示更多活动规则
    */
    showMore: function () {
      this.showArrow = !this.showArrow
    },
    /**
    * 切换竞猜状态
    */
    changeStatu: function (index) {
      this.guessStatuIndex = index
    },
    /**
     * 得到竞猜赔率
     */
    getOdds: function (item, idx) {
      if (idx === 0) {
        return item.oddsa.toFixed(2)
      } else if (idx === 1) {
        return item.oddsdraw.toFixed(2)
      } else {
        return item.oddsb.toFixed(2)
      }
    },
    /**
     * 比赛结束后的赔率
     */
    endOdss: function (item) {
      if (item.goala > item.goalb) { // a队比分大于b队
        return item.oddsa.toFixed(2)
      } else if (item.goala < item.goalb) {
        return item.oddsb.toFixed(2)
      } else if (item.goala !== null && item.goalb !== null && item.goala === item.goalb) {
        return item.oddsdraw.toFixed(2)
      } else {
        return '--'
      }
    },
    /**
    * 竞猜积分弹出层
    */
    showCover: function (index, idx, item) {
      let leng = this.matchingList[index].gameStatus.length
      for (let i = 0; i < leng; i++) {
        this.matchingList[index].gameStatus[i].ac = 0
        // this.$set(this.matchingList[index].gameStatus, i, 0)
      }
      this.matchingList[index].gameStatus[idx].ac = 1
      // this.$set(this.matchingList[index].gameStatus, idx, 1)
      // 选中赔率
      if (idx === 0) {
        this.choiceOdds = item.oddsa
      } else if (idx === 1) {
        this.choiceOdds = item.oddsdraw
      } else {
        this.choiceOdds = item.oddsb
      }
      this.highestRewardScore = parseInt(this.choiceOdds * this.choicePoint) // 理论最高奖励积分 = 赔率 * 投注积分
      // 把item当成确认竞猜的数据
      this.guessObj.guessid = item.id
      if (idx === 1) {
        this.guessObj.teamId = 'he'
      } else if (idx === 0) {
        this.guessObj.teamId = item.teama.id
      } else {
        this.guessObj.teamId = item.teamb.id
      }
      // 打开遮罩层
      setTimeout(() => {
        this.showHide = true
        // this.$refs.activity3.style.overflowY = 'hidden'
      }, 200)
    },
    /**
     * 选择竞猜积分
     */
    pickPoint: function (point) {
      this.choicePoint = point
      this.highestRewardScore = parseInt(this.choiceOdds * this.choicePoint) // 理论最高奖励积分 = 赔率 * 投注积分
    },
    /**
     * 确认竞猜（提交竞猜）
     */
    submitGuess: function () {
      this.mask.loading = true // loading
      var that = this
      // console.info(this.guessObj)
      // console.info(this.guessObj.guessid, this.guessObj.teamId, this.choicePoint)
      var params = new FormData()
      params.append('xid', this.propData.userinfo.xuid)
      params.append('guessid', this.guessObj.guessid)
      params.append('team', this.guessObj.teamId)
      params.append('score', this.choicePoint)
      this.$ajax({
        method: 'post',
        url: '/matchGuessing',
        data: params
      }).then((res) => {
        console.info(res)
        if (res.data.resphead.respcode === '0000') {
          console.info('成功')
          that.getData() // 更新用户积分数据
          that.showHide = false // 关闭竞猜弹出层
          setTimeout(() => {
            that.showPointSuccess = true // 成功积分弹出层
            // this.$refs.activity3.style.overflowY = 'hidden'
          }, 200)
        } else if (res.data.resphead.respcode === '1003') { // 1003 积分不足
          that.showHide = false // 关闭竞猜弹出层
          setTimeout(() => {
            that.showPointFail = true // 积分不足弹出层
            // this.$refs.activity3.style.overflowY = 'hidden'
          }, 200)
        } else if (res.data.resphead.respcode === '1001') { // 1001 参数错误
          console.info(res.data.resphead.respdetails)
          that.showPointIllegal = true // 弹出层-竞猜积分输入不合法
          // this.$refs.activity3.style.overflowY = 'hidden'
          setTimeout(() => {
            that.showPointIllegal = false
            // this.$refs.activity3.style.overflowY = 'scroll'
          }, 3000)
        } else if (res.data.resphead.respcode === '1009') { // 该场比赛已经停止竞猜!
          that.showHide = false // 关闭竞猜弹出层
          that.showPointTimeout = true // 弹出层-竞猜积分输入不合法
          // this.$refs.activity3.style.overflowY = 'hidden'
        }
        this.mask.loading = false // loading
      }).catch((error) => {
        console.info(error)
        this.mask.loading = false // loading
      })
    },
    /**
     * 关闭积分不足的弹出层
     */
    closePointFail: function () {
      setTimeout(() => {
        this.showPointFail = false
        // this.$refs.activity3.style.overflowY = 'scroll'
      }, 200)
    },
    /**
     * 关闭积分成功的弹出层
     */
    closePointSuccess: function () {
      this.showPointSuccess = false
      // this.$refs.activity3.style.overflowY = 'scroll'
    },
    /**
     * 积分不足跳转到大力神杯
     */
    goActivity4: function () {
      this.$router.push({name: 'tab2'})
      // this.$refs.activity3.style.overflowY = 'scroll'
    },
    /**
     * showHideMask
     */
    showHideMask () { // 弹出层-确认竞猜
      this.showHide = false
      // this.$refs.activity3.style.overflowY = 'scroll'
    },
    /**
     * showPointIllegalMask
     */
    showPointIllegalMask () { // 弹出层-竞猜积分输入不合法(不是100的整数倍)
      this.showPointIllegal = false
      // this.$refs.activity3.style.overflowY = 'scroll'
    },
    /**
     * showPointTimeoutMask
     */
    showPointTimeoutMask () { // 积分竞猜时间已过
      this.showPointTimeout = false
      this.getData()
      // this.$refs.activity3.style.overflowY = 'scroll'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Activity3{
  header{
    height: 5.3958rem; /* 777 */
    background: url(../../assets/ico_Main_vision.png) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    img{
      position: absolute;
      bottom: 0;
      left: .8125rem; /* 117 */
      width: .9167rem; /* 132 */
    }
  }
  section{
    padding-bottom: 1.3889rem; /* 200 */
    // height: 15.8958rem; /* 2289 */
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
    background-image: linear-gradient(0deg, #fc453f 1%, #fe8d2d 100%);
    -webkit-box-shadow: 0 .0347rem .1389rem 0 rgba(100, 0, 0, 0.3); /* 5 20 */
    -moz-box-shadow: 0 .0347rem .1389rem 0 rgba(100, 0, 0, 0.3); /* 5 20 */
    box-shadow: 0 .0347rem .1389rem 0 rgba(100, 0, 0, 0.3); /* 5 20 */
    div.tip{
      background: url(../../assets/fra_Rules_of_activity.png) no-repeat center center;
      background-size: 100% 100%;
      height: 3.1597rem; /* 455 */
      position: relative;
      h3{
        text-align: center;
        padding-top: .4rem;
        height: .3542rem; /* 51 */
        font-family: PingFangSC-Regular;
        font-size: .375rem; /* 54 */
        font-weight: normal;
        font-stretch: normal;
        line-height: 0px;
        letter-spacing: .0139rem; /* 2 */
        color: #fff0e5;
      }
      ol{
        margin-top: .1rem;
        li{
          padding: 0 .6389rem 0 .6806rem; /* 92 98 */
          font-family: PingFangSC-Regular;
          font-size: .2778rem; /* 40 */
          font-weight: normal;
          font-stretch: normal;
          line-height: .4167rem; /* 60 */
          letter-spacing: .0069rem; /* 1 */
          color: #e94d2f;
        }
        li.ellipsis{
          white-space:nowrap;
          text-overflow:ellipsis;
          overflow:hidden;
        }
      }
      ul{
        li{
          padding: 0 .6389rem 0 .6806rem; /* 92 98 */
          font-family: PingFangSC-Regular;
          font-size: .2778rem; /* 40 */
          font-weight: normal;
          font-stretch: normal;
          line-height: .4167rem; /* 60 */
          letter-spacing: .0069rem; /* 1 */
          color: #e94d2f;
        }
      }
      i{
        width: .5556rem; /* 80 */
        height: .4097rem; /* 59 */
        position: absolute;
        bottom: .4444rem; /* 64 */
        left: 50%;
        margin-left: -.2049rem; /* 29.5 */
        background: url(../../assets/ico_down.png) center center no-repeat;
        background-size: 100% 100%;
        &.down{
          transform: rotate(180deg);
          -ms-transform: rotate(180deg);
          -moz-transform: rotate(180deg);
          -webkit-transform: rotate(180deg);
          -o-transform: rotate(180deg);
        }
      }
    }
    .tip.tip_down{
      background: url(../../assets/fra_Rules_of_activity_down.png) no-repeat center center;
      background-size: 100% 100%;
      height: 6.1944rem; /* 892 */
    }
    nav{
      margin-left: .2361rem; /* 34 */
      height: .2361rem; /* 34 */
      font-family: PingFangSC-Regular;
      font-size: .25rem; /* 36 */
      font-weight: normal;
      font-stretch: normal;
      line-height: 0px;
      letter-spacing: 0px;
      color: #ffeeeb;
    }
    /* 竞猜 */
    .activity{
      margin-top: .2778rem; /* 40 */
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
          background-image: -ms-linear-gradient(-90deg,  #ff3036 0%, #f96212 100%);
          /* Opera 11.10+ */
          background-image: -o-linear-gradient(-90deg,  #ff3036 0%, #f96212 100%);
          /* Firefox 3.6+ */
          background-image: -moz-linear-gradient(-90deg,  #ff3036 0%, #f96212 100%);
          /* Webkit: Safari 5.1+, Chrome 10+ */
          background-image: -webkit-linear-linear-gradient(-90deg,  #ff3036 0%, #f96212 100%);
          /* Webkit: Safari 4-5, Chrome 1-9 */
          background-image: -webkit-linear-gradient(-90deg,  #ff3036 0%, #f96212 100%);
          background-image: linear-gradient(-90deg,  #ff3036 0%, #f96212 100%);
          box-shadow: -.0278rem .0139rem .1389rem 0px rgba(77, 22, 0, 0.2); /* 4 2 20 */
          -moz-box-shadow: -.0278rem .0139rem .1389rem 0px rgba(77, 22, 0, 0.2); /* 4 2 20 */
          -webkit-box-shadow: -.0278rem .0139rem .1389rem 0px rgba(77, 22, 0, 0.2); /* 4 2 20 */
          border-radius: .1389rem .1389rem 0 0; /* 20 */
        }
        li.active{
          /* IE < 10 */
          background-image: -ms-linear-gradient(#fff0e5);
          /* Opera 11.10+ */
          background-image: -o-linear-gradient(#fff0e5);
          /* Firefox 3.6+ */
          background-image: -moz-linear-gradient(#fff0e5);
          /* Webkit: Safari 5.1+, Chrome 10+ */
          background-image: -webkit-linear-linear-gradient(#fff0e5);
          /* Webkit: Safari 4-5, Chrome 1-9 */
          background-image: -webkit-linear-gradient(#fff0e5);
          background-image: linear-gradient(#fff0e5);
          background: #fff0e5;
          color: #e94d2f;
        }
      }
      // 正在竞猜
      div.guessing{
        ul{
          li{
            width: 6.8889rem; /* 992 */
            height: 3.5208rem; /* 507 */
            background: #fff0e5;
            box-shadow: 0px .0694rem .2083rem 0px rgba(255, 12, 0, 0.5); /* 10 30 */
            border-radius: .1389rem; /* 20 */
            margin: 0 auto;
            margin-bottom: .2778rem; /* 40 */
            .team{
              display: box; /* OLD - Android 4.4- */
              display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
              display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
              display: -ms-flexbox; /* TWEENER - IE 10 */
              display: -webkit-flex; /* NEW - Chrome */
              display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              -webkit-box-pack: space-evenly;
              /* 12版 */
              -webkit-justify-content: space-evenly;
              -moz-justify-content: space-evenly;
              -ms-justify-content: space-evenly;
              -o-justify-content: space-evenly;
              justify-content: space-evenly;
              /* 09版 */
              -webkit-box-align: center;
              /* 12版 */
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
              -o-align-items: center;
              align-items: center;
              div{
                padding: .2778rem 0; /* 40 */
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
                img{
                  width: 1.0625rem; /* 153 */
                  height: .7361rem; /* 106 */
                  // margin-bottom: .1389rem; /* 20 */
                }
                span{
                  // height: 43px;
                  display: inline-block;
                  margin-top: .1389rem; /* 20 */
                  font-family: PingFangSC-Regular;
                  font-size: .3194rem; /* 46 */
                  font-weight: normal;
                  font-stretch: normal;
                  letter-spacing: 0px;
                  color: #e94d2f;
                }
              }
              div:nth-of-type(1){
                -webkit-box-flex: 30;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 30; /* OLD - Firefox 19- */
                width: 30%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 30; /* Chrome */
                -ms-flex: 30; /* IE 10 */
                flex: 30; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              }
              div:nth-of-type(3){
                -webkit-box-flex: 30;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 30; /* OLD - Firefox 19- */
                width: 30%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 30; /* Chrome */
                -ms-flex: 30; /* IE 10 */
                flex: 30; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              }
              div:nth-of-type(2){
                -webkit-box-flex: 40;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 40; /* OLD - Firefox 19- */
                width: 40%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 40; /* Chrome */
                -ms-flex: 40; /* IE 10 */
                flex: 40; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                span:nth-of-type(2){
                  display: inline-block;
                  margin-top: .1806rem; /* 26 */
                  width: 2.0833rem; /* 300 */
                  height: .4514rem; /* 65 */
                  /* IE < 10 */
                  background-image: -ms-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  /* Opera 11.10+ */
                  background-image: -o-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  /* Firefox 3.6+ */
                  background-image: -moz-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  /* Webkit: Safari 5.1+, Chrome 10+ */
                  background-image: -webkit-linear-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  /* Webkit: Safari 4-5, Chrome 1-9 */
                  background-image: -webkit-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  background-image: linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  border-radius: .2222rem; /* 32 */
                  font-family: PingFangSC-Regular;
                  font-size: .25rem; /* 36 */
                  font-weight: normal;
                  font-stretch: normal;
                  line-height: .4514rem; /* 65 */
                  letter-spacing: 0px;
                  color: #fff0e5;
                  text-align: center;
                }
              }
            }
            .clickOdds{
              height: .3056rem; /* 44 */
              font-family: PingFangSC-Regular;
              font-size: .3194rem; /* 46 */
              font-weight: normal;
              font-stretch: normal;
              line-height: .3056rem; /* 44 */
              letter-spacing: 0px;
              color: #e94d2f;
              text-align: center;
            }
            .odds{
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
              div{
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
                /* 12版 */
                -webkit-justify-content: center;
                -moz-justify-content: center;
                -ms-justify-content: center;
                -o-justify-content: center;
                justify-content: center;
                text-align: center;
                width: 1.8403rem; /* 265 */
                height: .9306rem; /* 134 */
                margin-top: .2014rem; /* 29 */
                border-style: solid;
                border-width: .0208rem; /* 3 */
                // border-image-source: linear-gradient(-90deg, #ff3137 0%, #fb6c1e 100%);
                // border-image-slice: 1;
                border-radius: .0694rem; /* 10 */
                font-family: PingFangSC-Regular;
                font-size: .3056rem; /* 44 */
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #e94d2f;
                span{
                  font-size: .25rem; /* 36 */
                }
              }
              div.active{
                /* IE < 10 */
                background-image: -ms-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                /* Opera 11.10+ */
                background-image: -o-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                /* Firefox 3.6+ */
                background-image: -moz-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                /* Webkit: Safari 5.1+, Chrome 10+ */
                background-image: -webkit-linear-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                /* Webkit: Safari 4-5, Chrome 1-9 */
                background-image: -webkit-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                background-image: linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                -moz-box-shadow: 0px .0694rem .1389rem 0px rgba(255, 1, 1, 0.2); /* 0 10 20 0 */
                -webkit-box-shadow: 0px .0694rem .1389rem 0px rgba(255, 1, 1, 0.2); /* 0 10 20 0 */
                box-shadow: 0px .0694rem .1389rem 0px rgba(255, 1, 1, 0.2); /* 0 10 20 0 */
                border-radius: .0694rem; /* 10 */
                color: #fff0e5;
              }
            }
          }
          li:last-child{
            margin-bottom: 0;
          }
        }
      }
      // 即将开始
      div.guess-start{
        ul{
          li{
            width: 6.8889rem; /* 992 */
            height: 2.2431rem; /* 323 */
            background: #fff0e5;
            box-shadow: 0px .0694rem .2083rem 0px rgba(255, 12, 0, 0.5); /* 10 30 */
            border-radius: .1389rem; /* 20 */
            margin: 0 auto;
            margin-bottom: .2778rem; /* 40 */
            p{
              // height: .2361rem; /* 34 */
              padding: .2708rem 0 .2083rem .2917rem; /* 39 0 30 42 */
              font-family: PingFangSC-Regular;
              font-size: .25rem; /* 36 */
              font-weight: normal;
              font-stretch: normal;
              letter-spacing: 0px;
              color: #e94d2f;
            }
            .team{
              display: box; /* OLD - Android 4.4- */
              display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
              display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
              display: -ms-flexbox; /* TWEENER - IE 10 */
              display: -webkit-flex; /* NEW - Chrome */
              display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              -webkit-box-pack: space-evenly;
              /* 12版 */
              -webkit-justify-content: space-evenly;
              -moz-justify-content: space-evenly;
              -ms-justify-content: space-evenly;
              -o-justify-content: space-evenly;
              justify-content: space-evenly;
              /* 09版 */
              -webkit-box-align: center;
              /* 12版 */
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
              -o-align-items: center;
              align-items: center;
              div{
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
                img{
                  width: 1.0625rem; /* 153 */
                  height: .7361rem; /* 106 */
                  // margin-bottom: .1389rem; /* 20 */
                }
                span{
                  // height: 43px;
                  display: inline-block;
                  margin-top: .1389rem; /* 20 */
                  font-family: PingFangSC-Regular;
                  font-size: .3194rem; /* 46 */
                  font-weight: normal;
                  font-stretch: normal;
                  letter-spacing: 0px;
                  color: #e94d2f;
                }
              }
              div:nth-of-type(1){
                -webkit-box-flex: 30;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 30; /* OLD - Firefox 19- */
                width: 30%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 30; /* Chrome */
                -ms-flex: 30; /* IE 10 */
                flex: 30; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              }
              div:nth-of-type(3){
                -webkit-box-flex: 30;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 30; /* OLD - Firefox 19- */
                width: 30%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 30; /* Chrome */
                -ms-flex: 30; /* IE 10 */
                flex: 30; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              }
              div:nth-of-type(2){
                -webkit-box-flex: 40;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 40; /* OLD - Firefox 19- */
                width: 40%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 40; /* Chrome */
                -ms-flex: 40; /* IE 10 */
                flex: 40; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                span:nth-of-type(2){
                  display: inline-block;
                  margin-top: .1806rem; /* 26 */
                  width: 2.0833rem; /* 300 */
                  height: .4514rem; /* 65 */
                  /* IE < 10 */
                  background-image: -ms-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  /* Opera 11.10+ */
                  background-image: -o-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  /* Firefox 3.6+ */
                  background-image: -moz-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  /* Webkit: Safari 5.1+, Chrome 10+ */
                  background-image: -webkit-linear-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  /* Webkit: Safari 4-5, Chrome 1-9 */
                  background-image: -webkit-linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  background-image: linear-gradient(-90deg, #ff3037 0%, #fb6c1e 100%);
                  border-radius: .2222rem; /* 32 */
                  font-family: PingFangSC-Regular;
                  font-size: .25rem; /* 36 */
                  font-weight: normal;
                  font-stretch: normal;
                  line-height: .4514rem; /* 65 */
                  letter-spacing: 0px;
                  color: #fff0e5;
                  text-align: center;
                }
              }
            }
          }
          li:last-child{
            margin-bottom: 0;
          }
        }
      }
      // 比赛结束
      div.guess-end{
        ul{
          li{
            width: 6.8889rem; /* 992 */
            height: 2.3542rem; /* 339 */
            background: #fff0e5;
            box-shadow: 0px .0694rem .2083rem 0px rgba(255, 12, 0, 0.5); /* 10 30 */
            border-radius: .1389rem; /* 20 */
            margin: 0 auto;
            margin-bottom: .2778rem; /* 40 */
            p{
              padding: .2708rem 0; /* 39 0 */
              font-family: PingFangSC-Regular;
              font-size: .25rem; /* 36 */
              font-weight: normal;
              font-stretch: normal;
              letter-spacing: 0px;
              color: #e94d2f;
              text-align: center;
            }
            .team{
              display: box; /* OLD - Android 4.4- */
              display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
              display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
              display: -ms-flexbox; /* TWEENER - IE 10 */
              display: -webkit-flex; /* NEW - Chrome */
              display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              -webkit-box-pack: space-evenly;
              /* 12版 */
              -webkit-justify-content: space-evenly;
              -moz-justify-content: space-evenly;
              -ms-justify-content: space-evenly;
              -o-justify-content: space-evenly;
              justify-content: space-evenly;
              /* 09版 */
              -webkit-box-align: center;
              /* 12版 */
              -webkit-align-items: center;
              -moz-align-items: center;
              -ms-align-items: center;
              -o-align-items: center;
              align-items: center;
              div{
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
                img{
                  width: 1.0625rem; /* 153 */
                  height: .7361rem; /* 106 */
                  // margin-bottom: .1389rem; /* 20 */
                }
                span{
                  // height: 43px;
                  display: inline-block;
                  margin-top: .1389rem; /* 20 */
                  font-family: PingFangSC-Regular;
                  font-size: .3194rem; /* 46 */
                  font-weight: normal;
                  font-stretch: normal;
                  letter-spacing: 0px;
                  color: #e94d2f;
                }
              }
              div:nth-of-type(1){
                -webkit-box-flex: 30;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 30; /* OLD - Firefox 19- */
                width: 30%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 30; /* Chrome */
                -ms-flex: 30; /* IE 10 */
                flex: 30; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              }
              div:nth-of-type(3){
                -webkit-box-flex: 30;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 30; /* OLD - Firefox 19- */
                width: 30%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 30; /* Chrome */
                -ms-flex: 30; /* IE 10 */
                flex: 30; /* NEW, Spec - Opera 12.1, Firefox 20+ */
              }
              div:nth-of-type(2){
                -webkit-box-flex: 40;  /* OLD - iOS 6-, Safari 3.1-6 */
                -moz-box-flex: 40; /* OLD - Firefox 19- */
                width: 40%; /* For old syntax, otherwise collapses. */
                -webkit-flex: 40; /* Chrome */
                -ms-flex: 40; /* IE 10 */
                flex: 40; /* NEW, Spec - Opera 12.1, Firefox 20+ */
                span:nth-of-type(1){
                  display: inline-block;
                  margin: 0;
                  width: .9861rem; /* 142 */
                  height: .5278rem; /* 76 */
                  // background-image: linear-gradient(-90deg, #ff3236 0%, #f96213 100%);
                  background: url(../../assets/ico_Match_plate.png) center center no-repeat;
                  background-size: 100% 100%;
                  border-radius: .0694rem; /* 10 */
                  font-size: .4167rem; /* 60 */
                  position: relative;
                  i:nth-of-type(1){
                    height: .5278rem; /* 76 */
                    position: absolute;
                    left: 0.076rem;
                    bottom: 0.09rem;
                  }
                  i:nth-of-type(2){
                    height: .5278rem; /* 76 */
                    position: absolute;
                    right: 0.076rem;
                    bottom: 0.09rem;
                  }
                }
                span:nth-of-type(2){
                  text-align: center;
                  width: 1.6667rem; /* 240 */
                  height: .6319rem; /* 91 */
                  /* IE < 10 */
                  background-image: -ms-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                  /* Opera 11.10+ */
                  background-image: -o-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                  /* Firefox 3.6+ */
                  background-image: -moz-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                  /* Webkit: Safari 5.1+, Chrome 10+ */
                  background-image: -webkit-linear-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                  /* Webkit: Safari 4-5, Chrome 1-9 */
                  background-image: -webkit-linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                  background-image: linear-gradient(-90deg, #ff3036 0%, #fb6a1e 100%);
                  box-shadow: 0px .0694rem .1389rem 0px rgba(255, 1, 1, 0.2);
                  line-height: .6319rem; /* 91 */
                  border-radius: .0694rem; /* 10 */
                  color: #fff0e5;
                }
              }
            }
          }
          li:last-child{
            margin-bottom: 0;
          }
        }
      }
    }
  }
  /* 积分 */
  .points{
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
    .choice-points{
      height: 4.8611rem; /* 700 */
      // width: 100%;
      width: 7.5rem; /* 1080 */
      position: absolute;
      left: 0;
      bottom: 0;
      background: #fff;
      z-index: 9999;
      p{
        height: .7986rem; /* 115 */
        line-height: .7986rem; /* 115 */
        padding-left: .2847rem; /* 41 */
        background: #f6f6f6;
        font-family: PingFangSC-Regular;
        font-size: .3194rem; /* 46 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #333333;
        span{
          color: #e94d2f;
        }
      }
      p.max-point{
        height: .4167rem; /* 60 */
        line-height: .4167rem; /* 60 */
        margin-block-end: .25rem; /* 36 */
        background: #fff;
      }
      nav{
        div{
          height: .8333rem; /* 120 */
          display: box; /* OLD - Android 4.4- */
          display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
          display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
          display: -ms-flexbox; /* TWEENER - IE 10 */
          display: -webkit-flex; /* NEW - Chrome */
          display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
          /* 09版 */
          -webkit-box-align: center;
          /* 12版 */
          -webkit-align-items: center;
          -moz-align-items: center;
          -ms-align-items: center;
          -o-align-items: center;
          align-items: center;
          padding-left: .2847rem; /* 41 */
          font-family: PingFangSC-Regular;
          font-size: .3194rem; /* 46 */
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          span{
            color: #333333;
          }
          input{
            flex: 1;
            color: #e94d2f;
            font-size: .3194rem; /* 46 */
            height: .8333rem; /* 120 */
          }
          ::-webkit-input-placeholder { /* WebKit browsers */
            color: #ccc;
          }
          :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #ccc;
          }
          ::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #ccc;
          }
          :-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #ccc;
          }
        }
        ul{
          padding-left: .2778rem; /* 40 */
          overflow: hidden;
          li{
            float: left;
            width: 1.6042rem; /* 231 */
            height: .6111rem; /* 88 */
            line-height: .6111rem;
            text-align: center;
            margin-right: .1389rem; /* 20 */
            margin-bottom: .2083rem; /* 30 */
            border: .0139rem solid #e94d2f; /* 2 */
            border-radius: .3056rem; /* 44 */
            font-family: PingFangSC-Regular;
            font-size: .3194rem; /* 46 */
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #e94d2f;
          }
          li.active{
            color: #fff0e5;
            /* IE < 10 */
            background-image: -ms-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
            /* Opera 11.10+ */
            background-image: -o-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
            /* Firefox 3.6+ */
            background-image: -moz-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
            /* Webkit: Safari 5.1+, Chrome 10+ */
            background-image: -webkit-linear-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
            /* Webkit: Safari 4-5, Chrome 1-9 */
            background-image: -webkit-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
            background-image: linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
          }
        }
      }
      button{
        // width: 7.5rem; /* 1080 */
        width: 100%;
        display: block;
        height: .9028rem; /* 130 */
        border: 0 none;
        outline: none;
        font-family: PingFangSC-Regular;
        font-size: .375rem; /* 54 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #fff0e5;
        z-index: 9999;
        /* IE < 10 */
        background-image: -ms-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
        /* Opera 11.10+ */
        background-image: -o-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
        /* Firefox 3.6+ */
        background-image: -moz-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
        /* Webkit: Safari 5.1+, Chrome 10+ */
        background-image: -webkit-linear-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
        /* Webkit: Safari 4-5, Chrome 1-9 */
        background-image: -webkit-linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
        background-image: linear-gradient(-90deg, #fe3136 0%, #fb6b1f 100%);
      }
    }
  }
  /* 积分不足弹出层 */
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
          margin: .15rem 0;
          text-align: center;
        }
        span:nth-of-type(2){
          font-size: .3611rem; /* 52 */
        }
      }
      button{
        display: block;
        margin: .3472rem auto 0; /* 50 */
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
  /* 积分成功弹出层 */
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
        margin-top: 1.875rem; /* 270 */
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
  /* 积分输入不合法 */
  .points-illegal{
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
    .illegal{
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
        font-size: .4444rem; /* 64 */
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
  /* 积分竞猜时间已过 */
  .points-timeout{
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
    .timeout{
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
        font-size: .4444rem; /* 64 */
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
  /* vue过渡类 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}
</style>

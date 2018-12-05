<template>
  <div class="Share" ref="share">
    <div class="container">
      <div class="logo"><img src="../../assets/ico_logo2.png" alt=""></div>
      <div class="input box">
        <h3>验证手机 接受邀请</h3>
        <div class="phone">
          <div>手机号</div>
          <input v-model="phone" type="number">
        </div>
        <div class="code">
          <div>验证码</div>
          <a @click="clickGetCode" :class="{disabled: !getCode.statu}" href="javascript:void(0)">{{getCode.txt}}</a>
          <input v-model="code" type="number">
        </div>
        <a @click="download" href="javascript:void(0)">下载优理宝</a>
      </div>
      <div class="demonstration box">
        <h3>接受邀请操作演示</h3>
        <ol>
          <li>
            <p>完成本页上方手机号验证并点击下载优理宝</p>
            <div><img src="../../assets/invitation_img_step1.png" alt=""></div>
            <i>1</i>
          </li>
          <li>
            <p>下载优理宝APP</p>
            <div><img src="../../assets/invitation_img_step2.png" alt=""></div>
            <i>2</i>
          </li>
          <li>
            <p>打开优理宝，点击下方“我的”，在最上部按提示完成注册（注册的手机号必须和邀请页面的手机号一致哦）</p>
            <div><img src="../../assets/invitation_img_step3.png" alt=""></div>
            <i>3</i>
          </li>
          <li>
            <p>回到首页，点击顶部广告图，参与竞猜瓜分1亿积分！</p>
            <div><img src="../../assets/invitation_img_step4.png" alt=""></div>
            <i>4</i>
          </li>
        </ol>
      </div>
    </div>
    <footer>
      <div><img src="../../assets/invitation_ico_app.png" alt=""></div>
      <div><img src="../../assets/invitation_img_qrcode.png" alt=""></div>
      <div>
        <h3>兴业证券优理宝</h3>
        <p>轻松炒股，优理财富，就选优理宝！</p>
      </div>
    </footer>
    <div class="pop-ups">
      <!-- 手机号已被注册 -->
      <transition name="fade">
        <div v-if="mask.invite" class="supernatant invite">
          <div>
            <div class="txt">当前手机号已被成功邀请</div>
            <nav>
              <a @click="closeMask(0)" href="javascript:void(0)">取消</a>
              <a @click="closeMask(0)" href="javascript:void(0)">知道了，继续</a>
            </nav>
          </div>
        </div>
      </transition>
      <!-- 提示 -->
      <transition name="fade">
        <div v-if="mask.prompt" class="prompt"><span>{{prompt.txt}}!</span></div>
      </transition>
    </div>
    <!-- 加载 -->
    <Loading v-if="mask.loading"></Loading>
  </div>
</template>

<script>
import Loading from '../common/Loading'

export default {
  name: 'Share',
  data () {
    return {
      phone: '', // 手机号
      code: '', // 验证码
      ownerPhone: '', // 邀请人的手机号
      scrollTop: 0, // 当前滚动的top值
      getCode: { // 获取验证码
        statu: 1, // 当前状态 0置灰不可点 1可点
        time: 60, // 倒计时
        timer: null, // 定时器
        txt: '获取验证码' // 当前显示文字
        // txt: '60s后重取'
      },
      prompt: {
        txt: '', // 提示窗显示文字
        timer: null // 定时器
      },
      mask: { // 弹窗控制
        invite: false, // 邀请弹窗
        prompt: false, // 提示弹窗
        loading: false // 加载
      }
    }
  },
  components: { // 公共组件
    Loading
  },
  methods: {
    /**
     * 弹出提示窗
     */
    showPrompt: function (txt) {
      this.prompt.txt = txt
      this.mask.prompt = true
      // 防止定时器重复
      if (this.prompt.timer) {
        clearTimeout(this.prompt.timer)
      }
      // 延迟三秒隐藏
      this.prompt.timer = setTimeout(() => {
        this.mask.prompt = false
      }, 3000)
    },
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['invite']
      // this.$refs.share.style.overflowY = 'hidden'
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     */
    closeMask: function (index) {
      var arr = ['invite']
      // this.$refs.share.style.overflowY = 'scroll'
      this.mask[arr[index]] = false
    },
    /**
     * 点击 下载优理宝
     */
    download: function () {
      // 优理宝ylb_世界杯_大力神杯_邀请页_下载 埋点
      window.TDAPP.onEvent('ylb_WC_Mister_Download', '', {acc: '', tel: ''})
      if (!this.phone) { // 没有输入手机号
        this.showPrompt('请输入手机号')
      } else if (!this.code) { // 没有输入验证码
        this.showPrompt('请输入验证码')
      } else if (!this.GLOBAL.pattern(this.phone)) { // 输入错误手机号
        this.showPrompt('手机号错误，请重新输入!')
      } else {
        this.mask.loading = true
        this.$ajax({
          url: '/invitation',
          params: {
            ownerPhone: this.ownerPhone,
            phone: this.phone,
            code: this.code
          }
        }).then((res) => {
          console.log(res.data)
          if (res.data.resphead.respcode === '0000') { // 成功
            window.location.href = 'http://wap.xyzq.com.cn'
          } else if (res.data.resphead.respcode === '1005') { // 异常
            this.openMask(0)
          } else if (res.data.resphead.respcode === '1006' || res.data.resphead.respcode === '1007' || res.data.resphead.respcode === '1008') { // 异常
            this.showPrompt(res.data.resphead.respdetails)
          } else { // 其它
            this.showPrompt('服务器繁忙，请稍后重试')
          }
          this.mask.loading = false
        }).catch((err) => {
          console.log(err)
          this.showPrompt('服务器繁忙，请稍后重试')
          this.mask.loading = false
        })
      }
    },
    /**
     * 点击 获取验证码
     */
    clickGetCode: function () {
      if (this.getCode.statu) {
        if (!this.phone) { // 没有输入手机号
          this.showPrompt('请输入手机号')
        } else if (!this.GLOBAL.pattern(this.phone)) { // 输入错误手机号
          this.showPrompt('手机号错误，请重新输入!')
        } else {
          this.mask.loading = true
          this.$ajax({
            url: '/sendSms',
            params: {phone: this.phone}
          }).then((res) => {
            console.log(res.data)
            const resp = res.data
            if (resp.resphead.respcode === '0000') { // 成功
              this.getCode.statu = 0
              this.getCode.time = 60
              this.getCode.txt = this.getCode.time + 's后重取'
              this.getCode.timer = setInterval(() => {
                this.getCode.txt = this.getCode.time + 's后重取'
                this.getCode.time--
                if (this.getCode.time <= 0) {
                  this.getCode.statu = 1
                  this.getCode.txt = '获取验证码'
                }
              }, 1000)
            } else if (resp.resphead.respcode === '1004') { // 短信发送失败
              this.showPrompt('短信发送失败')
            } else { // 其它
              this.showPrompt('服务器繁忙，请稍后重试')
            }
            this.mask.loading = false
          }).catch((err) => {
            console.log(err)
            this.showPrompt('服务器繁忙，请稍后重试')
            this.mask.loading = false
          })
        }
      }
    }
  },
  beforeMount: function () {
    // 从url中获取邀请人手机号
    this.ownerPhone = this.GLOBAL.getQueryString('ownerPhone') || ''
    // 我的大力神杯-邀请页 埋点
    window.TDAPP.onEvent('Wechat_WC_Invite', '', {acc: '', tel: ''})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Share{
  > .container{
    background-image: url("../../assets/ico_zhuangshi.png"), url("../../assets/shijiebei_bg.jpg");
    background-repeat: no-repeat, no-repeat;
    background-size: .694444rem 7.027778rem, cover; /* 100 1012 */
    background-position: right 13.597222rem, 0 0; /* 1958 */
    padding: 6.465278rem .368056rem 1.833333rem .361111rem; /* 931 53 264 52 */
    .logo{
      width: 2.416667rem; /* 348 */
      height: .506944rem; /* 73 */
      position: absolute;
      top: .215278rem; /* 31 */
      left: .215278rem; /* 31 */
    }
    .box{
      background-color: #fff3f3;
      box-shadow: 0px .069444rem .208333rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
      border-radius: .138889rem; /* 16 */
      position: relative;
      h3{
        position: absolute;
        left: 50%;
        top: -.347222rem; /* 50 */
        margin-left: -2.152778rem; /* 310 */
        width: 4.3125rem; /* 621 */
        height: .833333rem; /* 120 */
        line-height: .833333rem; /* 120 */
        background-image: url("../../assets/invitation_block_title.png");
        background-size: contain;
        background-repeat: no-repeat;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: .354167rem; /* 51 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #fff0e5;
      }
    }
    .input{
      padding: .881944rem .569444rem .541667rem; /* 127 82 78 */
      input{
        display: block;
        width: 100%;
        height: .833333rem; /* 120 */
        line-height: .833333rem; /* 120 */
        background-color: #ffffff;
        border: solid .013889rem #fae6e6; /* 2 */
        border-radius: .111111rem; /* 16 */
        font-family: PingFangSC-Regular;
        font-size: .354167rem; /* 51 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #d9d9d9;
        padding-left: 1.458333rem; /* 210 */
        box-sizing: border-box;
        -moz-box-sizing:border-box; /* Firefox */
        -webkit-box-sizing:border-box; /* Safari */
      }
      > div {
        position: relative;
        > div{
          position: absolute;
          padding-left: .208333rem; /* 30 */
          height: .833333rem; /* 120 */
          line-height: .833333rem; /* 120 */
          font-family: PingFangSC-Regular;
          font-size: .354167rem; /* 51 */
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #d9d9d9;
        }
      }
      > .code{
        margin-top: .3125rem; /* 45 */
        a{
          margin-top: .1875rem; /* 27 */
          position: absolute;
          top: 0;
          right: 0;
          height: .458333rem; /* 66 */
          line-height: .458333rem; /* 66 */
          text-align: center;
          width: 1.875rem; /* 270 */
          border-left: .013889rem solid #fae6e6;
          font-family: PingFangSC-Regular;
          font-size: .270833rem; /* 39 */
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #e20c0e;
          &.disabled{
            color: #aaa;
          }
        }
      }
      > a{
        margin-top: .611111rem;
        display: block;
        text-align: center;
        height: .875rem; /* 126 */
        line-height: .875rem; /* 126 */
        background-image: -webkit-linear-gradient(117deg, #ff4c5a 0%, #ff8e51 100%);
        background-image: -o-linear-gradient(-27deg, #ff4c5a 0%, #ff8e51 100%);
        background-image: -moz-linear-gradient(-27deg, #ff4c5a 0%, #ff8e51 100%);
        background-image: linear-gradient(-27deg, #ff4c5a 0%, #ff8e51 100%);
        box-shadow: 0px 10px 20px 0px rgba(255, 12, 0, 0.3), inset -7px -7px 25px 0px rgba(216, 31, 12, 0.25);
        border-radius: .416667rem; /* 60 */
        font-family: PingFangSC-Medium;
        font-size: .375rem; /* 54 */
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #fff;
      }
    }
    .demonstration{
      margin-top: .722222rem; /* 104 */
      padding-top: .972222rem; /* 140 */
      ol{
        li{
          position: relative;
          padding-bottom: .208333rem; /* 40 */
          p{
            padding: 0 .451389rem 0 .986111rem; /* 65 142 */
            font-family: PingFangSC-Regular;
            font-size: .333333rem; /* 48 */
            font-weight: normal;
            font-stretch: normal;
            line-height: .444444rem; /* 64 */
            letter-spacing: 0px;
            color: #d81c1d;
          }
          i{
            position: absolute;
            top: 0;
            left: .347222rem; /* 50 */
            width: .416667rem; /* 60 */
            height: .416667rem; /* 60 */
            line-height: .416667rem; /* 60 */
            text-align: center;
            background-color: #feb5b5;
            border-radius: 50%;
            font-family: PingFangSC-Semibold;
            font-size: .354167rem; /* 51 */
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #d81c1d;
            border: solid .020833rem #fff3f3; /* 3 */
            &::after{
              content: '';
              position: absolute;
              left: 50%;
              top: .451389rem; /* 65 */
              margin-left: -.024306rem; /* 3.5 */
              width: .048611rem; /* 7 */
              background-color: #feb1b1;
            }
          }
          &:nth-child(1){
            div{
              margin: .347222rem 0 0 1.118056rem; /* 50 161 */
              width: 5.006944rem; /* 721 */
              height: 4.131944rem; /* 595 */
            }
            i::after{
              height: 5.125rem; /* 738 */
            }
          }
          &:nth-child(2){
            div{
              margin: .465278rem 0 0 2.4375rem; /* 67 351 */
              width: 3.423611rem; /* 493 */
              height: 4.409722rem; /* 635  */
            }
            i::after{
              height: 5.298611rem; /* 763 */
            }
          }
          &:nth-child(3){
            div{
              margin: .444444rem 0 0 2.4375rem; /* 64 351 */
              width: 3.145833rem; /* 453 */
              height: 4.430556rem; /* 638  */
            }
            i::after{
              height: 6.173611rem; /* 889 */
            }
          }
          &:nth-child(4){
            div{
              margin: .416667rem 0 0 1.0625rem; /* 60 153 */
              width: 3.256944rem; /* 469 */
              height: 4.805556rem; /* 492  */
            }
            i::after{
              height: 4.798611rem; /* 691 */
            }
            i:before{
              content: '';
              position: absolute;
              top: 5.243056rem; /* 755 */
              left: 50%;
              margin-left: -.131944rem; /* 19 */
              width: .229167rem; /* 33 */
              height: .229167rem; /* 33 */
              background-color: #feb5b5;
              border: solid .020833rem #fff3f3; /* 3 */
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
  > footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.458333rem; /* 210 */
    background-color: #ffffff;
    box-shadow: 0px -5px 10px 0px rgba(0, 0, 0, 0.1);
    div{
      &:nth-child(1){
        float: left;
        width: .888889rem; /* 128 */
        height: .888889rem; /* 128 */
        padding: .284722rem; /* 41 */
      }
      &:nth-child(2){
        float: right;
        width: 1.0625rem; /* 153 */
        height: 1.0625rem; /* 153 */
        padding: .201389rem .25rem .194444rem 0; /* 29 36 28 */
      }
      &:nth-child(3){
        padding-left: 1.465278rem; /* 211 */
        h3{
          padding-top: .347222rem;
          height: .3125rem; /* 45 */
          font-family: PingFangSC-Regular;
          font-size: .333333rem; /* 48 */
          font-weight: normal;
          font-stretch: normal;
          line-height: .3125rem; /* 45 */
          letter-spacing: 0px;
          color: #333333;
        }
        p{
          padding-top: .173611rem; /* 25 */
          height: .277778rem; /* 40 */
          font-family: PingFangSC-Regular;
          font-size: .270833rem; /* 39 */
          font-weight: normal;
          font-stretch: normal;
          line-height: .3125rem; /* 45 */
          letter-spacing: 0px;
          color: #878787;
        }
      }
    }
  }
  > .pop-ups{
    .invite{
      > div{
        width: 5.006944rem; /* 721 */
        background-color: #fff3f3;
        box-shadow: 0px .069444rem .208333rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
        border-radius: .166667rem; /* 24 */
        padding-top: .958333rem; /* 138 */
        div{
          text-align: center;
          height: .3125rem; /* 45 */
          font-family: PingFangSC-Regular;
          font-size: .333333rem; /* 48 */
          font-weight: normal;
          font-stretch: normal;
          line-height: 0px;
          letter-spacing: 0px;
          color: #353535;
        }
        nav{
          margin-top: .722222rem; /* 138 */
          border-top: .013889rem solid #f5dcdc; /* 2 */
          a{
            float: left;
            width: 50%;
            height: .916667rem; /* 132 */
            line-height: .916667rem; /* 132 */
            font-family: PingFangSC-Medium;
            font-size: .291667rem; /* 42 */
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #999999;
            text-align: center;
            &:last-of-type{
              color: #d81c1d;
              border-left: .013889rem solid #f5dcdc; /* 2 */
              box-sizing: border-box;
            }
          }
        }
      }
    }
    .prompt{
      position: fixed;
      max-width: 7.5rem;
      left: 50%;
      width: 100%;
      top: 8.069444rem; /* 1162 */
      transform: translateX(-50%);
      z-index: 3;
      height: .722222rem; /* 104 */
      line-height: .722222rem; /* 104 */
      text-align: center;
      span{
        display: inline-block;
        font-family: PingFangSC-Medium;
        font-size: .270833rem; /* 39 */
        height: .722222rem; /* 104 */
        color: #fff;
        background-color: rgba(0, 0, 0, .8);
        padding: 0 .458333rem; /* 66 */
      }
    }
  }
}
</style>

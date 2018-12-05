export default {
  // 判断微信环境
  isWeixin: function () {
    var ua = navigator.userAgent.toLowerCase()
    if ((ua.match(/MicroMessenger/i) + '') === 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  // 判断手机是安卓还是ios
  isAndroid: function () {
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) return true
    return false
  },
  /**
   * 获取url地址参数
   * @param  {[type]} name [地址参数名]
   * @return {[type]}      [description]
   */
  getQueryString: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  /**
   * 获取字符串长度（区分英文汉字）
   */
  strlen: function (str) {
    var len = 0
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i)
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        len++
      } else {
        len += 2
      }
    }
    return len
  },
  /**
   * 手机号码验证
   */
  pattern: function (str) {
    var pattern = /^1(3|4|5|7|8|9)\d{9}$/
    return pattern.test(str)
  },
  /**
   * 判断url中是否含有某个值
   */
  urlJudgment: function (name) {
    var href = window.location.href
    if (href.indexOf(name) > -1) return true
    return false
  },
  /**
   * 字符串过滤
   */
  strFilter: function (str) {
    const arr = str.split('.')
    return arr[0]
  },
  /**
   * 获取是涨是跌
   */
  getClass: function (now, preClosePrice) {
    return parseFloat(now) - parseFloat(preClosePrice) > 0 ? '+' : (parseFloat(now) - parseFloat(preClosePrice) === 0 ? '' : '-')
  },
  /**
   * 将时间戳改为时间格式
   * @param  {[type]} time [description]
   * @return {[type]}      [description]
   */
  changeTimeType: function (time) {
    // 简单的一句代码
    var date = new Date(time) // 获取一个时间对象  注意：如果是uinx时间戳记得乘于1000。比如php函数time()获得的时间戳就要乘于1000
    // 例子，比如需要这样的格式：yyyy-MM-dd hh:mm:ss
    // var date = new Date(1398250549490)
    // var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    // var M = date.getMonth() + 1 + '月'
    // var D = date.getDate() + '日 '
    var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
    // var h = date.getHours() + ':'
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
    // var m = date.getMinutes() + ':'
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    // var s = date.getSeconds()
    return (M + D + h + m) // 输出结果：2014-04-23 18:55:49
  },
  /**
   * 年月日
   */
  changeTimeTypeElse: function (time) {
    // 简单的一句代码
    var date = new Date(time) // 获取一个时间对象  注意：如果是uinx时间戳记得乘于1000。比如php函数time()获得的时间戳就要乘于1000
    // 例子，比如需要这样的格式：yyyy-MM-dd hh:mm:ss
    // var date = new Date(1398250549490)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    // var M = date.getMonth() + 1 + '月'
    // var D = date.getDate() + '日  '
    var D = date.getDate() < 10 ? '0' + date.getDate() + '日  ' : date.getDate() + '日 '
    // var h = date.getHours() + ':'
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
    // var m = date.getMinutes() + ':'
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    // var s = date.getSeconds()
    return (Y + M + D + h + m) // 输出结果：2014-04-23 18:55:49
  }
}

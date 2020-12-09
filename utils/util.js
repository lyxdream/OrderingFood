const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 时间
function formatTime1(date) {
  var ms = 86400000; //一天
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  var times = {
    year: [year, month, day].map(formatNumber).join('-'),
    hour: [hour, minute].map(formatNumber).join(':'),
    mday: month + "月" + day + "日",
  }
  return JSON.stringify(times);
}
function deepClone(obj) {
    let objClone = JSON.parse(JSON.stringify(obj));
    return objClone;
}
  //获取符合条件的所有class所有dom元素的信息
  function getAllRects (className,callback){
    wx.createSelectorQuery().selectAll(className).boundingClientRect().exec(function(res){
      callback(...res)
    })
  }
    //获取单个dom元素信息
   function getRect(id,callback){
      wx.createSelectorQuery().select('#'+id).boundingClientRect(function(rect){
        callback(rect)
      }).exec()
    }
    // 节流  函数在一段时间内多次触发只会执行第一次，在这段时间结束前，不管触发多少次也不会执行函数。
// 当网络条件差或卡顿的情况下，使用者会认为点击无效而进行多次点击，最后出现多次跳转页面的情况
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
  
}

  // 正则
  const regularObj = {
    // 手机号正则
    regePhone: function (val) {
      return /^1[3456789]\d{9}$/.test(val);
    },
    // 正则身份证
    regeIdCard: function (val) {
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val);
    },
    // 正则护照
    regHuZhao: function (val) {
      return /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-zA-Z])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)|(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/.test(val);
    },
    // 正则军官证号
    regJunGuan:function(val){//汉字加8位数字
      return /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/.test(val);
    }
  }
  function failToast(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000,
      mask: true
   })
  }
module.exports = {
  formatTime: formatTime,
  formatTime1:formatTime1,
  deepClone:deepClone,
  getAllRects:getAllRects,
  getRect:getRect,
  throttle:throttle,
  regularObj:regularObj,
  failToast:failToast
}

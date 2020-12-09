// pages/login/bindMobile/bindMobile.js
var util = require('../../../utils/util.js');
const httpUtil = require('../../../utils/httpUtil.js'); //接口和key文件
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "", //手机号
    verifyCode: "", //验证码
    isCode: true, //避免重复获取验证码
    times: "", //定时器名称
    second: 60, //获取验证码倒计时
    getCodeWord: "获取验证码",
    isReadTreaty: false, //是否阅读协议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        phone: wx.getStorageSync('UserPhoneNo')
      })
      console.log(this.data.phone)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  //协议
  changeReadTreatyStatus(){
      this.setData({
        isReadTreaty:!this.data.isReadTreaty
      })
  },
  // 获取验证码输入的值
  getCodeValue(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  //  获取手机号验证码
  getVerifyCode(){
    if (!this.data.phone) {
      util.failToast('手机号不能为空')
      return false;
    };
    if (!util.regularObj.regePhone(this.data.phone)) {
     util.failToast('请输入正确的手机号')
      return false;
    };
    this.getVerifyKey(this.data.phone);
  },
  //获取key
    getVerifyKey(phone) {
      let that = this;
      httpUtil.requestApi({
        url: app.globalData.bindBaseUrl+"user/getKey",
        method:"GET",
        data: {
          language:'CN',
          source:'MINI',
          openId:app.globalData.openId
        },
        success(resData) {
          console.log(resData.data)
          if (resData.data.code == 0) {
               that.getPhoneCode(resData.data.rst, phone);
          } else {
               util.failToast('验证码key值获取失败，请稍后再重试!')
              return false;
            
          }
        }
      })
    },
    //获取验证码
    getPhoneCode(codeKey, phone) {
      let that = this;
      if (this.data.isCode) {
        this.setData({
          isCode: false
        });
        httpUtil.requestApi({
          url: app.globalData.bindBaseUrl+"user/sendMessage",
          method:"GET",
          data: {
            language:'CN',
            source:'MINI',
            openId:app.globalData.openId,
            mobile:phone,
            key:codeKey
          },
          success(resData) {
             let data = resData.data;
            if (data.code == 0) {
               that.data.times = setInterval(function () {
                if (that.data.second <= 0) {
                  that.setData({
                    getCodeWord: "获取验证码",
                    second: 60,
                    isCode: true
                  })
                  clearInterval(that.data.times);
                } else {
                  that.setData({
                    getCodeWord: '倒计时' + that.data.second--
                  })
                };
              }, 1000);
            } else {
                util.failToast(data.msg)
                return false;
            }
          }
        })
      }
    },
     // 绑定信息校验
    bindMobile() {
      if (!app.globalData.openId) {
        util.failToast('绑定信息失败')
        return false;
      }
      if (this.data.phone.length == 0 || !util.regularObj.regePhone(this.data.phone)) {
        util.failToast('请输入正确的手机号')
        return false;
      }
      if (this.data.verifyCode.length == 0) {
        util.failToast('验证码不能为空')
        return false;
      }
      if (!this.data.isReadTreaty) { //未点击已阅读协议按钮
        util.failToast('请您确定已阅读会员服务协议。')
        return false;
      } else {
        let postData = {
          mobile: this.data.phone, //手机号
          searchText: this.data.phone,
          identifyingCode: this.data.verifyCode, //验证码（通过发送短信接口获取）
        };
        this.subMitMsg(postData);
      }
    },
    // 提交绑定信息
    subMitMsg(postData){
      console.log(postData)
      let that =  this;
      httpUtil.requestApi({
        url: app.globalData.bindBaseUrl+`xxxx&openId=${app.globalData.openId}`,
        method:"POST",
        data: {
          mobile:postData.mobile,
          searchText:postData.searchText,
          identifyingCode:postData.identifyingCode
        },
        success(resData) {
          console.log(resData.data)
          if (resData.data.code == 0) {
              if (resData.data.data.status == 200) {
                  wx.setStorageSync('cidOrder', resData.data.data.data.userInfo.cid);
                  wx.showToast({
                    title: resData.data.data.message,
                    icon: 'success',
                    duration: 2000,
                    mask: true,
                    success:function(){
                        wx.switchTab({
                          url: '/pages/index/index'
                        })
                    }
                 })
              }else {
                  util.failToast(resData.data.data.message)
                  return false;
             }
          } 
        }
      })

    },
    //查看协议
  // 跳转服务须知和隐私政策
  menuJump: util.throttle(function (e) {
    var isH5 = e.currentTarget.dataset.ish5; //是否是H5页面
    var path = e.currentTarget.dataset.path; //路径
    console.log(isH5,path)
    if (!isH5) { //非h5页面，小程序
      wx.navigateTo({
        url: path
      })
    } else {
      wx.setStorage({
        key: 'airportLink',
        data: path
        });
        wx.navigateTo({
           "url": "/pages/webView/webView"
        })
     
    }
  }, 2000),
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
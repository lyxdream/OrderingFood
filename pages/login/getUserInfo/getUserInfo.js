// pages/getUserInfo/getUserInfo.js
const app = getApp()
var util = require('../../../utils/util.js');
const httpUtil = require('../../../utils/httpUtil.js'); //接口和key文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  // 授权获取手机号
  getPhoneNumber(e){
    wx.checkSession({
      success: res => {
          if (e.detail.encryptedData){
            //授权
            let openId = app.globalData.openId;
            let encryptedData = e.detail.encryptedData;
            let iv = e.detail.iv; 
            this.phoneInfo(openId, encryptedData, iv)
          }else{
            // 未授权
              console.log("拒绝授权");
          }
      }})
},
//解密获取手机号
  phoneInfo(openId, encryptedData, iv){
    let that = this;
      httpUtil.requestApi({
        url: app.globalData.baseUrl+"getUserPhone",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method:"POST",
        data: {
            openId: openId,
            encryptedData: encryptedData,
            iv: iv
        },
      success(resData) {
        if(resData.data&&resData.data.code==0){
             wx.setStorageSync('UserPhoneNo', resData.data.data.phoneNumber);
             wx.redirectTo({
                url:"/pages/login/bindMobile/bindMobile"
             })
        }else{
           //解密失败
            wx.showToast({
              title: '绑定手机号失败',
              icon: 'none',
              image: '/images/icon-error.png',
              duration: 2000,
              mask: true
           })
            console.log('绑定手机号失败')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
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
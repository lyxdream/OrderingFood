//link.js
//获取应用实例
const app = getApp()
Page({
  data: {
    link: ""
  },
  onLoad: function(e) {
    var that = this;
    wx.getStorage({
      key: 'airportLink',
      success(res) {
        var link = res.data;
        that.setData({
          link: link
        });
      }
    });
  
  },
})
const app = getApp();
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#f00",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/home.png",
      selectedIconPath: "/images/homeCurr.png",
      text: "首页",
      isSpecial: false
    }, {
      pagePath: "/pages/shopCart/shopCart",
      iconPath: "/images/home.png",
      selectedIconPath: "/images/homeCurr.png",
      text: "购物车",
      isSpecial: false
    }, {
      pagePath: "/pages/order/order",
      iconPath: "/images/home.png",
      selectedIconPath: "/images/homeCurr.png",
      text: "我的",
      isSpecial: false
    }],
    //适配IphoneX的屏幕底部横线
    footerHeight:app.globalData.footerHeight,
  },
  attached() {},
  methods: {
    switchTab(e) {
      const dataset = e.currentTarget.dataset
      const path = dataset.path
      const index = dataset.index
      //如果是特殊跳转界面
      if (this.data.list[index].isSpecial) {
        wx.navigateTo({
          url: path
        })
      } else {
        //正常的tabbar切换界面
        this.setData({
          selected: index
        })
        wx.switchTab({
          url: path
        })
      }
    }
  }
})

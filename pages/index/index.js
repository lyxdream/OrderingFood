const app = getApp()
const utils = require('./../../utils/util.js'); //接口和key文件
var plugin = requirePlugin("myPlugin")
// pages/order/order.js
Page({

  //右侧分类的高度累加数组
  //比如：[洗车数组的高度，洗车+汽车美容的高度，洗车+汽车美容+精品的高度，...]
  heightArr: [], //右侧各个元素距离顶部距离的数组
    // // [160, 320, 1140, 1300, 1570, 1840, 2000]
    //  // 160：洗车标题高度50px，item的高度110，洗车只有一个item，所以50+110*1=160px;
    //  // 320: 汽车美容标题高度50px，只有一个item，再加上洗车的高度，所以50+110*1+160=320px;
  //记录scroll-view滚动过程中距离顶部的高度
  heightLeftArr:[],//左侧距离的高度
  distance: 0,  //右侧到顶部的距离
  distanceLeft:0,//左侧到顶部的距离

  /**
   * 页面的初始数据
   */

  /**
   * 页面的初始数据
   */
  data: {
    footerHeight: app.globalData.footerHeight,//底部的高度
    currentLeft: 0, //左侧选中的下标
    selectId: "item0",  //当前显示的元素id
    scrollTop: 0, //到顶部的距离
    height:0,//获取整个屏幕的高度
    headHeight:0,//获取头部的高度
    leftMenuHight:0,//左侧每个元素的高度
    leftscrollTop:0,//左侧滚动的距离
    noticeHeight:0,//公告的高度
    serviceTypes: [
      {
        type:"粉类主食",
        services:[
          {
            id:607,
            name:'红烧牛肉面',
            label:'',
            count:1,
            price:'32.00'
          },
          {
            id:608,
            name:'番茄牛肉面',
            label:'',
            count:1,
            price:'32.00'
          }
        ]
      },
      {
        type:"盖饭类",
        services:[
          {
            id:607,
            name:'牛肉饭',
            label:'',
            count:1,
            price:'32.00'
          },
          {
            id:608,
            name:'鸡腿饭',
            label:'',
            count:1,
            price:'32.00'
          }
        ]
      },
      {
        type:"凉拌类",
        services:[
          {
            id:607,
            name:'凉皮',
            label:'',
            count:1,
            price:'32.00'
          },
          {
            id:607,
            name:'海带',
            label:'',
            count:1,
            price:'32.00'
          }
        ]
      },
      {
        type:"烧烤类",
        services:[
          {
            id:607,
            name:'羊肉串',
            label:'',
            count:1,
            price:'32.00'
          },
          {
            id:608,
            name:'烤鸡翅',
            label:'',
            count:1,
            price:'32.00'
          }
        ]
      },
      {
        type:"饮品类",
        services:[
          {
            id:607,
            name:'可口可乐',
            label:'',
            count:1,
            price:'32.00'
          },
          {
            id:608,
            name:'雪碧',
            label:'',
            count:1,
            price:'32.00'
          }
        ]
      }
    ], //项目列表数据
    contProHight:0,//商品列表部分的高度
    bottomHight:0,//底部部分占位的高度
       openId:"oiY0v5c4UZy2dwFL-GlX_TiCBbU0",
    cid:"e17368bf9ffd49b084a21a888da2a3fa",
    phone:"17801129726",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置标题
    wx.setNavigationBarTitle({
      title: '首页',
    })
    utils.getRect('head',this.selectDom);//获取头部的高度
    utils.getRect('notice',this.notice);//获取公告的高度
    // utils.getRect('pro-empty',this.bottomH);//获取底部占位的高度
    
    let screenHeight =  wx.getSystemInfoSync().windowHeight;//可视区域整体高度
    let contProHight = screenHeight - this.data.headHeight - this.data.footerHeight;  // 产品列表的高度
    // console.log('产品列表的高度',contProHight,this.data.footerHeight)
   //获取可视区域的高度
    this.setData({
      height: screenHeight,
      contProHight:contProHight
    })
    //请求列表数据
    this.request();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    if (typeof this.getTabBar === 'function' &&this.getTabBar()) {
      console.log('设置选中项 0')
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
   //请求列表数据
   request() {
      utils.getAllRects ('.pro-box',this.setAllFn)//获取列表高度：计算右侧每一个分类的高度，在数据请求成功后请求即可
      utils.getAllRects ('.pro-title',this.setleftFn);//获取左侧每个元素高度
      console.log(this.heightLeftArr)
  },
  //搜索
  search(e){
    console.log(e.detail)  
  },

  //点击左侧元素事件
  proItemTap(e) {
    this.distanceLeft = this.data.leftMenuHight*e.currentTarget.dataset.pos;//记录此时左侧距离可视区域顶部的距离
    if(Math.ceil(this.distanceLeft)>this.data.contProHight || this.data.leftscrollTop >this.heightLeftArr[0]){
      //当前点击的左侧元素距离顶部的距离大于可视区域的距离或者此时左边的scrollTop大于-leftMenuHight，则让左侧的scrollTop为随当前点击的左侧元素距离顶部的距离
        this.setData({
          leftscrollTop:this.heightLeftArr[e.currentTarget.dataset.pos-1]
        })
    }
    //左侧选择项目点击事件 currentLeft：控制左侧选中样式  selectId：设置右侧应显示在顶部的id
    this.setData({
      currentLeft: e.currentTarget.dataset.pos,
      selectId: "item" + e.currentTarget.dataset.pos
    })
  },
  //监听scroll-view的滚动事件
  scrollEvent(event) {
    // console.log("滚动")
    if (this.heightArr.length == 0) {
        return;
    }
    let scrollTop = Math.ceil(event.detail.scrollTop);
    let current = this.data.currentLeft;
    if (scrollTop >= this.distance) { //页面向上滑动
      //如果右侧当前可视区域最底部到顶部的距离超过当前列表选中项距顶部的高度（且没有下标越界），则更新左侧选中项
      if (current + 1 <= this.heightArr.length && scrollTop >= this.heightArr[current]) {
        this.setData({
          currentLeft: current + 1
        })
        /*  
          当前左侧选中项距可视区域顶部的距离大于左侧可视区域的距离，则更改左侧的scrollTop值
           console.log(this.data.leftMenuHight*(this.data.currentLeft+1),'左侧选中项距可视区域顶部的距离(+1是因为下标是从0开始)')
           注意：左侧的menu高度不固定，则需要动态获取高度:this.heightLeftArr[index]
           60是底部tab的距离，因为是自定义的tabBar就会存在这个问题，如果是自定义的则不会存在这个问题
        */
        if(this.heightLeftArr[this.data.currentLeft]>this.data.contProHight-60){
          console.log('到底了')
          this.setData({
              leftscrollTop:this.heightLeftArr[this.data.currentLeft]
          })
        } 
      }
    } else { //页面向下滑动
      //如果右侧当前可视区域最顶部到顶部的距离 小于 当前列表选中的项距顶部的高度，则更新左侧选中项
      if (current - 1 >= 0 && scrollTop < this.heightArr[current - 1]) {
         this.setData({
          currentLeft: current - 1,
        })
        //左侧距离可视区域顶部的距离如果大于0，则则更新左侧scrollTop的值，使左侧项目向上滚动
        // console.log(this.distanceLeft,'距离顶顶')
        // console.log(this.data.leftscrollTop,'距离顶顶233')
       // console.log('数组',(this.data.currentLeft-1),this.heightLeftArr[this.data.currentLeft-1])
        if(this.distanceLeft>0){
          //下表越界判断this.data.currentLeft>0
            this.setData({
                leftscrollTop:this.data.currentLeft>0?this.heightLeftArr[this.data.currentLeft-1]:0
            })
        }
      }
    }
    //更新到顶部的距离
    this.distance = scrollTop;//重新设置右侧距离顶部的距离
    this.distanceLeft = this.data.leftscrollTop;//重新设置左侧距离顶部的距离
  },
  //选中符合条件所有dom元素的回调函数
  setAllFn(...res){
    // console.log(res)
     let h = 0;
    res[0].forEach((item) => {
      h += item.height;
      this.heightArr.push(h);
    })
  },
//获取左侧每个元素的高度：
setleftFn(...res){
  // console.log(res)
  let h=0;
  res[0].forEach((item) => {
     h+=item.height;
     this.heightLeftArr.push(h);
      this.setData({
        leftMenuHight:Math.ceil(item.height)
      })
  })
},

  //获取头部元素的高度
  selectDom(res){
    this.setData({
      headHeight:Math.ceil(res.height)
    })
    // console.log(this.data.headHeight)
  },
  //获取公告的高度
  notice(res){
    this.setData({
      noticeHeight:Math.ceil(res.height)
    })
    // console.log(this.data.noticeHeight)
  },
    //获取底部部分占位的高度
    bottomH(res){
      this.setData({
        bottomHight:Math.ceil(res.height)
      })
      // console.log(this.data.bottomHight)
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
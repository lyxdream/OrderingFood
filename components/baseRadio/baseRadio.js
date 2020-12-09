// components/baseRadio/baseRadio.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked:{
      type:Boolean,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    radioImg:"/images/common/unselect.png",
    radioImgCurr:"/images/common/select.png",
  },

  /**
   * 组件的方法列表
   */
  methods: {
  
  }
})

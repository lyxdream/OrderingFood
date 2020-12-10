// components/goods/goods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemName:{
      type:Object,
      value:{}
    },
    idx:{
      type:Number,
      value:0
    },
    index:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
     
  },

  /**
   * 组件的方法列表
   */
  methods: {
    decrease(val){
      console.log(val)
    },
    add(val){
        console.log(val)
        
    }
  }
})

// components/baseControl/baseControl.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    number:{  //传入的数量
        type:Number,
        value:0,
        observer: function(newVal, oldVal) {
            console.log('值',newVal)
        }
      }
  },
  attached: function() {
    // 在组件实例进入页面节点树时执行
    console.log(this.properties.num)
     this.setData({
        num:this.properties.number
     })

  },
  /**
   * 组件的初始数据
   */
  data: {
    addImg:"/images/common/add.png",
    decreaseImg:"/images/common/decrease.png",
    num:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    decrease(){
      let number = this.data.num>0?--this.data.num:0;
      this.setData({
        num:number
     })
      this.triggerEvent('decrease',this.data.num)
    },
    add(){
      this.setData({
          num:++this.data.num
      })
       this.triggerEvent('add',this.data.num)
    }
  }
})

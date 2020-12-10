// components/searchBox/searchBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    searchKey:"",//关键词
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search(e){
        // console.log(e)
        this.setData({
          searchKey: e.detail.value
        })
        this.triggerEvent('search',this.data.searchKey)
    }
   
  }
})

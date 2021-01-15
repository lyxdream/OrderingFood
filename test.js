let params = [1, 2, 3]

let arr = params.forEach((item) => {
    item = item * 2
    console.log(item)
})

let arr1 = params.map((item) => {
    return (item = item * 2)
})
console.log(arr)
console.log(arr1)
console.log(params)
function  changeNumber(goodsItem){
      let productList = this.data.productList;
       goodsItem.count = ++goodsItem.count; //增加数量
     let shop = {
         shopCode: this.data.shopCode,
          shop_name: this.data.shop_name,
          table:this.data.table,//桌台号
          goodsList: [] //添加的商品的数组
      };
       shop.goodsList.push(goodsItem);
        if(Object.keys(productList).length!=0){ //如果购物车不为空
            if(productList.goodsList.length!=0){
                 const product = utils.isHasItem(productList.goodsList,goodsItem.item_code,'item_code');//判断购物车里是否存在该商品
                if (product) {
                    product.count = shop.goodsList[0].count;  //修改count
                } else {
                    //如果不存在则直接push
                    productList.goodsList.push(goodsItem);
                }
            }
        }else{
             productList.goodsList.push(shop);
        }
        app.globalData.productList = productList;
          //对应商品的数量赋值给列表
 }
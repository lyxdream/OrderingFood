# 扫码点餐：

点餐的整体流程：

-   扫码 -> 店铺商品列表 -> 去下单 -> 购物车 ->去结算 ->提示选择就餐人数 -> 预下单订单详情页（这里如果需要选择优惠券可以增加选择优惠券功能） ->去支付 ->唤起微信支付插件完成支付 -> 支付成功 -> 订单详情页
-   历史订单列表 -> 订单详情
    准备工作：
    -   生成一个小程序码 （小程序路径名?shopCode=店铺 code&table=桌台号）
        如： pages/home/home?shopCode=4000&table=103

下面主要介绍购物车逻辑以及需要注意的点：

1、列表页主要有三个基本功能：
  - 初始化列表数据
  - 点击增加，购物车对应商品数量加1
    - （注意如果有库存限制，记得做临界条件判断）
  - 点击减少，购物车对应商品数量减1
    - （注意临界判断，（1）购物车中当前商品数量为0时移除该商品信息（2）购物车的商品信息列表goodsList的长度为0时，移除整个店铺信息）

-   下次扫码上次购物车的商品是否还存在？
    -   如果需要缓存，则购物车需要存储多个店铺添加的商品信息，并缓存到本地
    -   如果不需要缓存，则购物车里面只会存在一个店铺添加的商品信息，不需要缓存到本地，只需要定义一个全局变量即可
-   如何把列表接口返回的商品和购物车对应的商品数量结合起来渲染到页面？
    **列表接口中的数据深拷贝之后（为了不修改原来的接口数据），循环遍历：**
    -   1、需要缓存的情况：（购物车为一个数组[],存放不同的店铺商品信息）
        -   判断当前购物车是否为空
        -   如果为空，则给当前扫码进入的店铺的所有商品，新增一个 count 属性，并置为 0
        -   如果不为空
            -   判断是否购物车中存在当前访问的店铺（当前店铺的 code 与购物车存在的店铺 code 进行对比）
                -   如果不存在，则给该店铺所有的商品，新增一个 count 属性，并置为 0
                -   如果存在该店铺，则需要判断是不是购物车中存在对应的商品信息（列表对应商品的 id 和购物车的商品 id 作对比）
                    -   如果不存在对应商品，则该商品 count 属性值置为 0
                    -   如果存在对应商品，则对应商品的数量置为购物车中保存的数量
    -   2、不需要缓存的情况：（购物车为一个对象,存放当前扫码进入的店铺的所有商品信息）
        -   判断当前购物车是否为空
            -   如果为空，则给当前扫码进入的店铺的所有商品，新增一个 count 属性，并置为 0
            -   如果不为空
                -   判断是不是购物车中存在对应的商品信息（列表对应商品的 id 和购物车的商品 id 作对比）
                    -   如果不存在对应商品，则该商品 count 属性值置为 0
                    -   如果存在对应商品，则对应商品的数量置为购物车中保存的 count

贴上核心代码如下：

定义一个初始化的方法，在初始化和每次商品数量改变之后，更新购物车的对应商品数量和列表对应的商品数量
**不需要缓存的情况**

```js
 /* 购物车的数据的结构：
  productList:{
      shopCode:'店铺code',
      table:'桌台号',
      shopName:'店铺名称',
      goodsList:[],//存储的商品信息列表
  }
  */
  initProlist(){
      let sub_menus = utils.deepClone(this.data.sub_menus)
      //因为列表返回的数据会有多个分类，需要获取到每个分类里面的商品信息就需要双层循环
        for(let i=0;i< sub_menus.length;i++){     //获取商品分类
          for(let j=0;j<sub_menus[i].items.length;j++){ //获取每个分类下的商品信息
              let goodsItem = sub_menus[i].items[j]; //每个商品信息
              if(Object.keys(this.data.productList).length!=0){ //如果购物车不为空
                      let productList = this.data.productList;
                      if(productList.goodsList.length!=0){
                          //判断购物车里的该店铺是否存在该商品
                          const isAdded = productList.goodsList.find(
                              item => item.item_code === goodsItem.item_code
                          );
                           //如果购物车存在当前商品
                          if (isAdded) {
                               // 则在列表中找到对应的该商品然后把count赋值给该商品
                               sub_menus[i].items[j].count = isAdded.count;
                          }else{
                               sub_menus[i].items[j].count = 0;
                          }
                      }

              }else{
                  sub_menus[i].items[j].count = 0;
              }
          }
        }
         this.setData({
            sub_menus:sub_menus
         })
  }

```
**需要缓存的情况**
```js
 /* 购物车的数据的结构：
  productList:[
      {
      shopCode:'店铺code',
      table:'桌台号',
      shopName:'店铺名称',
      goodsList:[],//存储的商品信息列表
     },
     {
      shopCode:'店铺code',
      table:'桌台号',
      shopName:'店铺名称',
      goodsList:[],//存储的商品信息列表
     }
  ]
  */
initProlist(){
       let sub_menus = utils.deepClone(this.data.sub_menus)
      //因为列表返回的数据会有多个分类，需要获取到每个分类里面的商品信息就需要双层循环
        for(let i=0;i< sub_menus.length;i++){     //获取商品分类
          for(let j=0;j<sub_menus[i].items.length;j++){ //获取每个分类下的商品信息
              let goodsItem = sub_menus[i].items[j]; //每个商品信息
              if (this.data.productList.length != 0) { //如果购物车不为空
                    let productList = this.data.productList;
                     //判断购物车是不是存在该店铺，如果存在该店铺则返回该店铺
                    let shopInfomation = productList.find(
                        item => item.shopCode === this.data.shopCode
                    );
                     if (shopInfomation) {
                      //如果购物车存在该店铺
                       if(shopInfomation.goodsList.length!=0){
                          //判断购物车里的该店铺是否存在该商品
                          const isAdded = shopInfomation.goodsList.find(
                              item => item.item_code === goodsItem.item_code
                          );
                           //如果购物车存在当前商品
                          if (isAdded) {
                               // 则在列表中找到对应的该商品然后把count赋值给该商品
                               sub_menus[i].items[j].count = isAdded.count;
                          }else{
                               sub_menus[i].items[j].count = 0;
                          }
                      }else{
                           sub_menus[i].items[j].count = 0;
                      }
                     }else{
                        sub_menus[i].items[j].count = 0;  
                     }
              }else{
                  sub_menus[i].items[j].count = 0;
              }
          }
        }
         this.setData({
            sub_menus:sub_menus
         })
  }

```














**购物车对象**

```JS
  productList: localStorage.getItem("productList")? JSON.parse(localStorage.getItem("productList")): [], //所有加入购物车的店铺列表
```

```js
if (this.productList.length != 0) {
    let shop = this.productList.find(
        (item) => item.storeCode === this.shopInfo.storeCode
    )
    if (shop) {
        if (shop.cartList.length != 0) {
            const isAdded = shop.cartList.find(
                (item) => item.id === this.goodsItem.id
            )
            //如果购物车存在当前商品
            if (isAdded) {
                this.num = isAdded.count
            }
        }
    }
} else {
    this.num = 0
}
```

**添加商品**

-   点击增加的时候，则根据当前元素的 id，给当前列表对应的商品加 1，同时如果购物车存在该商品则购物车里面的也要同步加 1.如果购物车里面的该商品不存在，则 push 进去这个商品，注意：添加商品的时候注意库存，如果 Num 大于等于库存，则让 num=库存

<!-- 注意如果有很多店铺 -->

-   点击添加的时候要注意区分店铺，有可能有很多店铺，每个店铺应该是一个对象，分开存贮商品（所以每次在添加的时候都创建一个新的店铺对象）
    let shop = {
    storeCode: this.shopInfo.storeCode,
    name: this.shopInfo.name,
    distance: this.shopInfo.distance,
    cartList: [];//添加的商品的数组
    };
-   深拷贝当前添加的商品， let goods = deepClone(this.goodsItem);
-   判断当前添加的的商品对象有没有 count 属性，如果没有则添加一个 count 属性，并且值置为 1
    if (!goods.count) {
    // 新增属性
    this.\$set(goods, "count", 1);
    }
-   把添加的商品 push 到当前新的店铺对象
    shop.cartList.push(goods);

-   然后新的店铺对象和购物车的店铺进行对比，如果购物车已经存在该店铺，则找到购物车对应的该店铺的商品，如果此时添加的商品购物车存在，则对应的商品增加 count，如果不存在则 push 该商品到购物车这个店铺

```js
   //shopInfomation是传入的新建的shop对象
           editCartCount(state, shopInfomation) {
           let shop = state.productList.find(
               item => item.storeCode === shopInfomation.storeCode
           );
           if (shop) {
               const product = shop.cartList.find(
                   item => item.id === shopInfomation.cartList[0].id
               );
               if (product) {
                   //如果购物车有这个商品
                   //修改count
                   product.count =
                       product.count + shopInfomation.cartList[0].count;
               } else {
                   shop.cartList.push(shopInfomation.cartList[0]);
               }
           } else {
               state.productList.push(shopInfomation);
           }
           localStorage.setItem(
               "productList",
               JSON.stringify(state.productList)
           );
       },
```

-   点击减少的时候，同样也是根据前元素的 id,找到其对应商品的数量，如果大于 1 则减 1，如果等于 1，则减去 1 后为 0，就从购物车移除该商品

大兴小程序：

1、获取购物车列表 productList

```js
  globalData: {
    productList:wx.getStorageSync('productList')?JSON.parse(wx.getStorageSync('productList')):[]
  },
```

2、首页

**初始化列表数量**

获取接口返回的商品列表的数据，然后判断购物车是否为空，

-   如果为空，就给该店铺列表数据每项添加一个 count 属性
-   如果不为空，则判断购物车是否存在该店铺
    -   如果存在该店铺，则店铺中的每项商品和购物车的作对比
        -   如果购物车存在该商品，则在列表中找到对应的该商品然后把购物车的 count 赋值给该商品
    -   如果不存在该店铺，就给该店铺列表数据每项添加一个 count 属性

```js
 initProlist(){
     let proData = utils.deepClone(this.data.proData);
    for(let i=0;i< proData.goodsDetail.length;i++){
      for(let j=0;j<proData.goodsDetail[i].goodsViewList.length;j++){
          let goodsItem = proData.goodsDetail[i].goodsViewList[j];
               if (this.data.productList.length != 0) {
                   let shopInfomation = this.data.productList.find(
                       item => item.storeCode === proData.storeCode
                   );
                   if (shopInfomation) {
                     //如果购物车存在该店铺
                       if (shopInfomation.cartList.length != 0) {
                         //判断购物车里的该店铺是否存在该商品
                           const isAdded = shopInfomation.cartList.find(
                               item => item.id === goodsItem.id
                           );
                           //如果购物车存在当前商品
                           if (isAdded) {
                             // 则在列表中找到对应的该商品然后把count赋值给该商品
                               proData.goodsDetail[i].goodsViewList[j].count = isAdded.count;
                               console.log( proData,'初始化数据')
                               this.setData({
                                   proData:proData
                               })
                           }

                       }
                   }else{
                       //如果购物车不存在该店铺
                        proData.goodsDetail[i].goodsViewList[j].count = 0;
                         this.setData({
                             proData:proData
                         })
                   }
               } else {
                     proData.goodsDetail[i].goodsViewList[j].count = 0;
                     this.setData({
                         proData:proData
                     })
               }
         }
     }
 },


```

**点击增加按钮:**

-   则根据当前元素的 id，在购物车查找对应的商品，如果购物车存在该商品则购物车里面的 count 加 1

```js
// 新建一个店铺对象
  let shop = {
    storeCode: this.data.proData.storeCode,
    name: this.data.proData.name,
    distance: this.data.proData.distance,
    cartList: [] //添加的商品的数组
};
- 深拷贝当前添加的商品， let goodsItem =  utils.deepClone(e.currentTarget.dataset.itemname);

- 当前点击添加的的商品对象数量加1

// 没有count属性，如果没有则添加一个count属性，并且值置为1
//  if(!goodsItem.count){
//     let obj={
//         count:1
//     }
//     goodsItem = {...goodsItem,...obj}
//  }
  goodsItem.count = ++goodsItem.count; //增加数量
- 把添加的商品push到当前新的店铺对象
    shop.cartList.push(goodsItem);
```

-   判断购物车是否为空，如果为空直接 push 新的店铺对象,如果不为空则判断
    不为空的情况：
    （1）如果购物车已经存在该店铺，则找到购物车对应的该店铺的商品，如果此时添加的商品购物车存在，则对应的商品增加 count，
    （2）如果不存在则 push 该商品到购物车这个店铺
    （3）操作完之后调重新渲染列表商品的数量的方法，同时更新本地购物车的商品

```js
if (this.data.productList.length != 0) {
    //如果购物车不为空
    //判断购物车是不是存在该店铺，如果存在该店铺则返回该店铺
    let shopInfomation = this.data.productList.find(
        (item) => item.storeCode === shop.storeCode
    )
    //如果存在该店铺
    if (shopInfomation) {
        //判断该店铺是否存在该商品，如果存在则但会该商品
        const product = shopInfomation.cartList.find(
            (item) => item.id === shop.cartList[0].id
        )
        if (product) {
            //如果购物车有这个商品
            //修改count
            product.count = shop.cartList[0].count
        } else {
            //如果不存在则直接push
            shopInfomation.cartList.push(shop.cartList[0])
        }
    } else {
        //如果购物车不存在该店铺
        this.data.productList.push(shop)
    }
} else {
    //如果购物车为空
    this.data.productList.push(shop)
}

//对应商品的数量赋值给列表
this.initProlist() //重新渲染列表商品的数量
```

-   操作完之后更新本地购物车的商品

```js
// 保存到本地
wx.setStorageSync('productList', JSON.stringify(this.data.productList))
```

实现的完整代码如下：

```js
    //增加购物车的商品
    add(e){
        console.log('当前商品',e.currentTarget.dataset)
        let goodsItem =  utils.deepClone(e.currentTarget.dataset.itemname); //点击的商品
        let typeId = e.currentTarget.dataset.typeId;//当前商品的分类id
        goodsItem.count = ++goodsItem.count; //增加数量
        this.changeNumber(goodsItem)
    },
//改变购物车商品数量
 changeNumber(goodsItem){
      let proData = utils.deepClone(this.data.proData); //商品列表数据
     let shop = {
          storeCode: this.data.proData.storeCode,
          name: this.data.proData.name,
          distance: this.data.proData.distance,
          cartList: [] //添加的商品的数组
      };
      shop.cartList.push(goodsItem);
        if(this.data.productList.length!=0){
            //如果购物车不为空
            //判断购物车是不是存在该店铺，如果存在该店铺则返回该店铺
            let shopInfomation = this.data.productList.find(
                item => item.storeCode === shop.storeCode
            );
            //如果存在该店铺
            if (shopInfomation) {
              //判断该店铺是否存在该商品，如果存在则但会该商品
                const product = shopInfomation.cartList.find(
                    item => item.id === shop.cartList[0].id
                );
                 if (product) {
                    //如果购物车有这个商品
                    //修改count
                    product.count = shop.cartList[0].count;
                } else {
                  //如果不存在则直接push
                    shopInfomation.cartList.push(shop.cartList[0]);
                }

            } else {
              //如果购物车不存在该店铺
                 this.data.productList.push(shop);
            }
        }else{
            this.data.productList.push(shop);
        }
        console.log('购物车商品',this.data.productList)
          //对应商品的数量赋值给列表
        this.initProlist();
        // 保存到本地
         wx.setStorageSync('productList', JSON.stringify( this.data.productList));
 },

```

**点击减少按钮:**

-   减少的原理和增加类似，只是每次点击一次，变为--count
-   除此之外，还要（1）判断该商品数量是否为 0，如果为 0,就删除整个商品，（2）如果购物车该店铺没有任何商品，则删除整个店铺

```js

  decrease(e){
     console.log('当前商品',e.currentTarget.dataset)
        let goodsItem =  utils.deepClone(e.currentTarget.dataset.itemname); //点击的商品
        let typeId = e.currentTarget.dataset.typeId;//当前商品的分类id
        goodsItem.count = goodsItem.count>0?--goodsItem.count:0;//改变数量
        // 如果当前商品数量为0则删除该商品
        if(goodsItem.count!=0){
          this.changeNumber(goodsItem)
        }else{
          this.deleteGoods(goodsItem)
        }
   },
//如果该商品数量为0则删除购物车该商品，如果购物车中该店铺的所有商品为0，则删除整个店铺
deleteGoods(goodsItem){
   let proData = utils.deepClone(this.data.proData); //商品列表数据
      if(this.data.productList.length!=0){
            //如果购物车不为空
          //判断购物车是不是存在该店铺，如果存在该店铺则返回该店铺
          let shopInfomation = this.data.productList.find(
              item => item.storeCode === proData.storeCode
          );
            //如果存在该店铺
          if (shopInfomation) {
            //判断该店铺是否存在该商品，如果存在则删除该商品
              const product = shopInfomation.cartList.find(
                  item => item.id === goodsItem.id
              );
                if (product) {
                  //如果购物车有这个商品，则移除该商品
                    let goodsIndex = shopInfomation.cartList.findIndex(
                        item => item.id === product.id
                    );
                    shopInfomation.cartList.splice(goodsIndex, 1);

                  //如果当前店铺的所有商品都删除了，则把当前店铺从购物车里移除
                    if (shopInfomation.cartList.length == 0) {
                      let index = this.data.productList.findIndex(
                          item => item.storeCode === shopInfomation.storeCode
                      );
                      this.data.productList.splice(index, 1)
                        //对应商品的数量赋值给列表
                       this.initProlist();

                   }
                   wx.setStorageSync('productList', JSON.stringify( this.data.productList));
              }
          }
    }
},
```

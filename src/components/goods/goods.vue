<!--  -->
<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item border-1px" :class="{'current':currentIndex==index}" @click="selectMenu(index,$event)" ref="leftListHook">
          <!-- v-for的时候必须要有:key ref可获取当前原生DOM结构
                    通过判断currentIndex的返回值确定当前class:current是否显示-->
          <span class="text">
                    <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span> {{item.name}}
          <!-- 通过item.type 判断显示classMap显示 -->
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list" ref="foodListHook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px" @click="seletFood(food,$event)">
              <div class="icon">
                <img :src="food.icon" alt="" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <div class="desc" v-show="food.description">{{food.description}}</div>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :seletFoods="seletFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food :food="seletedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import shopcart from "@components/shopcart/shopcart";
  import cartcontrol from "@components/cartcontrol/cartcontrol";
  import food from "@components/food/food";
  const ERR_OK = 0;
  export default {
    props: { //接收头部信息
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [], //定义请求来的数据
        listHeight: [], //定义右侧每个区块高度
        scrollY: 0, //定义右侧滚动距离
        num: 0, //获取左边当前li下标赋值到右边联动
        seletedFood: {}
      };
    },
    computed: { //计算属性
      currentIndex() { //计算滑动时当前scrollY在数组listHeight中的下标
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (this.scrollY >= height1 & this.scrollY < height2) {
            this.num = i; //赋值当前i方便做左边联动
            return i, this.num
          }
        }
        return 0
      },
      seletFoods() {
        //cartcontrol组件操作单个food的对象的改变会传递给goods组件里面的seletFoods，seletFoods是一个计算属性，观测goods对象，food发生变化重新计算goods重新赋给单个food,seletFoods再将变化的属性传递给shopcart组件，完成联动
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']; //左侧特殊图片的判断
      this.$http.get("/api/goods").then(response => { //数据请求
        response = response.data;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // console.log(this.goods)
          this.$nextTick(() => { //延迟回调在DOM之后
            // DOM发生变化在￥nextTick()之后
            this._initScroll();
            this._calculateHeight();
          })
        }
      })
    },
    methods: {
      _initScroll() { //初始化better-scroll
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true //在better-scroll下要在移动端点击时要将click置为true
        });
        this.foodsScroll.on('scroll', (pos) => {
          //better-scroll的滚动事件，获取右侧滚动的距离
          this.scrollY = Math.abs(Math.round(pos.y));
          this.leftMenu(this.num);
        })
      },
      _calculateHeight() { //获取每个右侧分类区块的高度
        let foodList = this.$refs.foodListHook; //获取右侧各大分类的li集合DOM结构
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu(index, event) { //右边联动
        if (!event._constructed) { //阻止浏览器原生click事件
          return;
        }
        let foodlist = this.$refs.foodListHook;
        let el = foodlist[index]; //获取到要滚动的右侧DOM结构
        this.foodsScroll.scrollToElement(el, 300);
        //scrollToElementel 滚动到的目标元素
      },
      leftMenu(num) { //滑动右边使左边联动
        // console.log(num)
        let leftlist = this.$refs.leftListHook;
        let el = leftlist[num]; //获取到要滚动的右侧DOM结构
        this.meunScroll.scrollToElement(el, 300);
        //scrollToElementel 滚动到的目标元素
      },
      seletFood(food, event) {
        if (!event._constructed) { //阻止浏览器原生click事件
          return;
        };
        this.seletedFood = food;
        this.$refs.food.show()//（来自于food组件）父组件调用子组件方法 子组件里写函数，在子组件组件标签上添加ref 直接调用
      }
    },
    components: { //组件引入属性
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/mixin'
.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  overflow hidden
  width 100%
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      width 56px
      height 54px
      padding 0 12px
      line-height 14px
      &.current
        position relative
        z-index 10
        background #ffffff
        font-weight 700
        margin-top -1px
        .text
          border-none()
      .icon
        display inline-block
        background-size 100% 100%
        background-repeat no-repeat
        width 12px
        height 12px
        margin-right 4px
        &.decrease
          bg-img('decrease_3')
        &.discount
          bg-img('discount_3')
        &.invoice
          bg-img('invoice_3')
        &.guarantee
          bg-img('guarantee_3')
        &.special
          bg-img('special_3')
      .text
        display table-cell
        vertical-align middle
        font-size 12px
        border-1px(rgba(7,17,27,.1 ))
  .foods-wrapper
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      font-size 12px
      color rgb(147,153,159 )
      background #f3f5f7
      border-left 2px solid #d9dde1
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,.1))
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px 0
          font-size 14px
          height 14px
          line-height 14 px
          color rgb(7,17,27)
        .desc,.extra
          font-size 10px
          color rgb(147,153,159)
        .desc
          margin-bottom 8px
          line-height 12px
        .extra
          font-size 0
          .count
            font-size 10px
            margin-right 12px
          .rating
            font-size 10px
        .price
          font-size 0
          font-weight 700
          height 24px
          line-height 24px
          .now
            display inline-block
            margin-right 8px
            font-size 14px
            color rgb(240,20,20)
          .old
            display inline-block
            text-decoration line-through
            font-size 10px
            color rgb(147,153,159)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px

</style>

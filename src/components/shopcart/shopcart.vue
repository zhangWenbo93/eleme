<!--  -->
<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price border-1px" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" :class="{'minWidth':this.screenWidth<=320}" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show" ref='ball'>
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food border-1px" v-for="(food,index) in seletFoods" :key="index" ref="food">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span class="unit-price">￥{{food.price*food.count}}</span>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import cartcontrol from "@components/cartcontrol/cartcontrol";
  export default {
    props: { //每次传递都需在子组件接收，数据来自APP.vue=通过路由组件=>goods.vue==>shopcart.vue
      deliveryPrice: { //往子组件传递数据必须定义
        type: Number
      },
      minPrice: {
        type: Number
      },
      seletFoods: {
        type: Array,
        default () { //在Vue里面，props是一个数组或者对象，default就要是一个函数
          return [{
            price: 10,
            count: 0
          }]
        }
      }
    },
    data() {
      return {
        screenWidth: document.body.clientWidth, //在IPhone5s上的购物车结算框适配
        balls: [{
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }],
        dropBalls: [],
        fold: true //fold为true隐藏listShow,为false显示
      }
    },
    computed: {
      totalPrice() { //通过定义的selectFoods遍历所有食物的价格和个数，乘积相加得总价
        // console.log(this.seletFoods)
        let total = 0;
        this.seletFoods.forEach((food) => {
          total += food.price * food.count
        });
        return total; //切记return
      },
      totalCount() { //通过定义的selectFoods遍历所有食物的个数，相加得总数
        let count = 0;
        this.seletFoods.forEach((food) => {
          count += food.count
        });
        return count;
      },
      payDesc() { //通过判断总价格的变化改变配送要求
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`; //``把this.minPrice这个变量用${}的方式传入反引号里  免除+拼接
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() { //通过判断总价格和最小起送价改变状态
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) { //如果食物个数为0，返回false隐藏(购物车餐数减到0，整个购物车隐藏)
          this.fold = true;
          return false;
        } //否则  取反显示
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.listScroll) { //better-scroll自动派发点击事件，不用在派发
              this.listScroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.listScroll.refresh();
            }
          })
        }
        return show
      }
    },
    created() {
      this.$root.drop.$on('cart.add', (target) => { //通过$on监听派发事件
        this.drop(target);
      });
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (ball.show === false) { //找到隐藏小球改变show状态，添加elment属性
            ball.show = true; //触发动画
            ball.el = el; //把点击按钮的dom赋予ball，方便beforeEnter里计算x,y
            this.dropBalls.push(ball);
            // console.log(this.dropBalls)打印为空是因为afterEnter里shift()方法执行完取走了里面的元素，所以始终为空
            return;
          }
        }
      },
      beforeEnter: function(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); //rect 是一个具有四个属性left、top、right、bottom的DOMRect对象
            let x = rect.left - 32; //计算小球位置
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = 'block';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0]; //获取当前执行动画小球里面子标签的的dom，此处不能用$refs，因为$refs[0]取得是所以子标签的第一个，而非当前的第一个
            el.style.transform = `translate3d(0,${y}px,0)`;
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      // // // 此回调函数是可选项的设置
      // // // 与 CSS 结合时使用*******
      enter: function(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; //不会使用这个变量（浏览器重绘）
        //浏览器重绘方法
        // *添加、删除、更新DOM节点
        // *通过display: none隐藏一个DOM节点-触发重排和重绘
        // *通过visibility: hidden隐藏一个DOM节点-只触发重绘，因为没有几何变化
        // *移动或者给页面中的DOM节点添加动画
        // *添加一个样式表，调整样式属性
        // *用户行为，例如调整窗口大小，改变字号，或者滚动。
        // *获取某些元素的属性（我使用的方法）
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        })
      },
      afterEnter: function(el) {
        let ball = this.dropBalls.shift(); //每次点击时this.dropBalls的第一个元素取走，留下this.dropBalls数组为空置状态，目的在于保持this.dropBalls始终处于空置状态，小球可以无限点击加载，
        if (ball) { //判断取出来的元素，存在改变状态，隐藏为初始状态
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.totalCount) { //点击时，个数为0不展示
          return
        }
        this.fold = !this.fold //fold的改变会影响lostShow的重新计算
      },
      empty() {//清空操作
        this.seletFoods.forEach((food) => {
          food.count = 0
        })
      },
      hideList() {//触发listShow重新计算，show变为false
        this.fold = true;
      },
      pay(){
        if (this.totalPrice < this.minPrice) {
          return
        } else {
          alert(`支付${this.totalPrice}元`)
        }
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import '~common/mixin'
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 55
    width 100%
    height 48px
    .content
      display flex
      height 100%
      font-size 0
      background #141d27
      .content-left
        flex 1
        position relative
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            background #2b343c
            border-radius 50%;
            text-align center
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              font-size 24px
              line-height 44px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0px
            right 0px
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 10px
            font-weight 700
            color #ffffff
            background red
            box-shadow 0 4px 8px rgba(0,0,0,.4)
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255,255,255,.1)
          font-size 16px
          font-weight 700
          color rgba(255,255,255,.4)
          &.highlight
            color #ff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 12px
          color rgba(255,255,255,.4)
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          font-size 12px
          height 48px
          line-height 48px
          text-align center
          color rgba(255,255,255,.4)
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            color #ffffff
            background #00b43c
      .minWidth
        flex 0 0 85px
        width 85px
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        &.drop-enter-active//定义过渡的状态。在元素整个过渡过程中作用，在元素被插入时生效，在 transition/animation 完成之后移除。这个类可以被用来定义过渡的过程时间，延迟和曲线函数。
          transition all .3s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition all .3s linear
    .shopcart-list
      position fixed
      left 0
      bottom 48px
      z-index -1
      width 100%
      transition all 0.4s
      transform translate3d(0,0,0)
      &.fold-enter,&.fold-leave-active
        transform translate3d(0,100%,0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 2px solid rgba(7,17,27,.1)
        display flex
        justify-content space-between
        .title
          font-size 14px
          color rgb(7,17,27)
        .empty
          font-size 12px
          color rgb(0,160,220)
      .list-content
        max-height 217px
        background #fff
        padding 0 18px
        overflow hidden
        .food
          display flex
          justify-content space-between
          font-size 14px
          height 48px
          line-height 48px
          border-1px(rgba(7,17,27,.1))
          .name
            font-size 14px
            color rgb(7,17,27)
          .price
            font-size 0
            display flex
            justify-content space-between
            .unit-price
              display inline-block
              margin-left  18px
              font-size 14px
              color rgb(240,20,20)
              font-weight 700
            .cartcontrol
              height 36px
              vertical-align top
              margin-top 6px
    .list-mask
      position fixed
      left 0
      top 0
      width 100%
      height 100%
      z-index -3
      backdrop-filter blur(10px)
      opacity 1
      background rgba(7,17,27,.6)
      &.fade-enter-active,&.fade-leave-active
        transition: all .4s
      &.fade-enter,&.fade-leave
        opacity 0
        background rgba(7,17,27,0)
</style>

<!--  -->
<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="foodScroll">
      <div class="foodScroll">
        <div class="food-content">
          <div class="img-header">
            <img :src="food.image" alt="">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="content-title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
            </div>
          </div>
          <div class="cartcontrol-wrapper-vue">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count||food.count===0" @click.stop.prevent="addFirst($event)">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <div class="title">商品评价</div>
          <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" class="avatar">
                </div>
                <div class="time">{{rating.rateTime|formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span> {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings ||!food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import cartcontrol from "@components/cartcontrol/cartcontrol";
  import split from "@components/split/split"; //default的不用加{}
  import ratingselect from "@components/ratingselect/ratingselect";
  import {
    formatDate
  } from "../../common/js/date";
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return { //传往ratingselect组件
        showFlag: false, //详情页隐藏显示
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: "全部",
          positive: "推荐",
          negative: "吐槽"
        }
      };
    },
    created() {
      this.$root.drop.$on('on-type-change', (val) => { //通过$on监听派发事件
        this.onTypeChange(val); //(这样写不用再dom结构绑定函数，通过ratingselect.vue里面的select函数触发到这里)
      });
      this.$root.drop.$on('on-type-content', (val) => { //通过$on监听派发事件
        this.onTypeContent(val);
      });
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        // console.log(date)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
      show() { //点击事件，被goods组件拿去使用
        this.showFlag = true; //food组件隐藏显示
        this.selectType = ALL; //商品评价的三个按钮
        this.onlyContent = false; //只看内容的评价
        this.$nextTick(() => {
          if (!this.foodScroll) {
            this.foodScroll = new BScroll(this.$refs.foodScroll, {
              click: true
            });
          } else {
            this.foodScroll.refresh();
          }
        })
      },
      onTypeChange: function(val) {
        this.selectType = val; //④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        this.$nextTick(() => {
          this.foodScroll.refresh();
        });
      },
      onTypeContent: function(val) {
        this.onlyContent = val;
        this.$nextTick(() => {
          this.foodScroll.refresh();
        });
      },
      hide() {
        this.showFlag = false
      },
      addFirst(evevt) {
        if (!event._constructed) { //阻止浏览器原生click事件，防止PC多次点击
          return;
        };
        this.$root.drop.$emit('cart.add', event.target) //给加入购物车也添加cart.add事件  小球飞入
        this.$set(this.food, "count", 1) //设置对象的属性。
      },
      needShow(type, text) {
        if (this.onlyContent && !text) { //是否显示内容
          return false
        };
        if (this.selectType === ALL) { //选择类型
          return true
        } else {
          return type === this.selectType;
        };
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import '~common/mixin'
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    width 100%
    z-index 30
    background #ffffff
    transform translate3d(0,0,0)
    &.move-enter-active,&.move-leave-active
      transition all .4s linear
    &.move-enter,&.move-leave-to
      transform translate3d(100%,0,0)
    .food-content
      position relative
      .img-header
        position relative
        width 100%
        height 0
        padding-top 100%//100%时，值得计算相对于盒子的宽度百分比计算
        img
          position absolute
          left 0
          top 0
          width 100%
          height 100%
        .back
          position absolute
          top 10px
          left 0
          .icon-arrow_lift
            display inline-block
            padding 10px
            font-size 20px
            color #ffffff
      .content
        padding 18px
        .content-title
          line-height 14px
          margin-bottom 8px
          font-size 14px
          font-weight 700
          color rgb(7,17,27)
        .detail
          font-size 0
          margin-bottom 18px
          height 10px
          line-height 10px
          .sell-count,.rating
            font-size 10px
            color rgb(147,153,159)
          .sell-count
            margin-right 12px
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
      .cartcontrol-wrapper-vue
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        padding 0 12px
        height 24px
        line-height 24px
        box-sizing border-box
        border-radius 12px
        font-size 12px
        color #fff
        background rgb(0,160,220)
        opacity 1
        &.fade-enter-active,&.fade-leave-active
          transition all .2s
        &.fade-enter,&.fade-leave-to
          opacity 0
    .info
      padding 18px
      .title
        margin-bottom 6px
        line-height 12px
        font-size 14px
        color rgb(7,17,27)
      .text
        font-size 12px
        line-height 24px
        color rgb(77,87,93)
        padding 0 8px
    .rating
      padding-top 18px
      .title
        padding-left 18px
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .rating-wrapper
        padding 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,.1))
          .user
            position absolute
            right 0
            top 16px
            font-size 0
            line-height 12px
            .name
              display inline-block
              vertical-align top
              margin-right 6px
              font-size 10px
              color rgb(147,153,159)
            .avatar
              display inline-block
              vertical-align top
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right 4px
              font-size 12px
              line-height 16px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
        .no-rating
          padding 16px
          font-size 12px
          color rgb(147,153,159)
</style>

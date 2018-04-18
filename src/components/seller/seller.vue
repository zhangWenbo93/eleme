<!--  -->
<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">{{seller.ratingCount}}</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite">
          <span class="icon-favorite" :class="{'active':favorite}" @click="toggleFavorite($event)"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li v-for="(item,index) in seller.supports" :key="index" class="supports-item border-1px">
            <i class="icon" :class="classMap[seller.supports[index].type]"></i>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pisc">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="pic">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li v-for="(info,index) in seller.infos" :key="index" class="info-item border-1px">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '@components/star/star'
  import BScroll from "better-scroll";
  import split from "@components/split/split"; //default的不用加{}
  import {saveToLocal,loadFromLocal} from "../../common/js/store"; //default的不用加{}
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (()=>{
          return loadFromLocal(this.seller.id,'favorite',false)
        })()
      };
    },
    watch: {
      'seller' () { //监听seller是否发生改变，
        this.$nextTick(() => { //在$nextTick(dom渲染完才能获取seller的高度)
          this._initScroll();
          this._initPic();
        })
      }
    },
    computed:{
      favoriteText(){
        return this.favorite?'已收藏':'收藏'
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']; //特殊图标的动态class处理
    },
    mounted() {
      this.$nextTick(function() {
        this._initScroll();
        this._initPic();
      })
    },
    methods: {
      _initScroll() {
        if (!this.sellerWrapper) {
          this.sellerWrapper = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.sellerWrapper.refresh();
        }
      },
      _initPic() {
        if (this.seller.pics) {
          let picW = 120;
          let margin = 6;
          let width = (picW + (margin - 1)) * (this.seller.pics.length);
          this.$refs.picList.style.width = `${width}px`;
          if (!this.picWrapper) {
            this.picWrapper = new BScroll(this.$refs.pic, {
              scrollX: true,
              eventPassthrough: 'vertical', //保留某一个方向的滚动
              click: true
            });
          } else {
            this.picWrapper.refresh()
          }
        }
      },
      toggleFavorite(event){
       if (!event._constructed) { //阻止浏览器原生click事件，防止PC多次点击
          return;
        };
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id,'favorite',this.favorite);
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import '~common/mixin'
  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      padding 18px
      .favorite
        position absolute
        right 18px
        top 18px
        width 37px
        text-align center
        .icon-favorite
          display block
          margin-bottom 4px
          line-height 24px
          font-size 24px
          color #d4d6d9
          &.active
            color rgb(250,20,20)
        .text
          display block
          line-height 10px
          font-size 10px
          color rgb(77,85,93)
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .desc
        padding-bottom 18px
        font-size 0
        border-1px(rgba(7,17,27,.1))
        .star
          display inline-block
          margin-right 8px
          vertical-align top
        .text
          line-height 18px
          display inline-block
          margin-right 12px
          vertical-align top
          font-size 10px
      .remark
        display flex
        padding-top 18px
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7,17,27,.1)
          &:last-child
            border none
          h2
            margin-bottom 4px
            line-height 10px
            font-size 10px
            color rgb(147,153,159)
          .content
            line-height 24px
            font-size 10px
            color rgb(7,17,27)
            .stress
              font-size 24px
    .bulletin
      padding 18px 18px 0 18px
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .content-wrapper
        padding 0 12px 18px 12px
        line-height 24px
        font-size 12px
        color rgb(240,20,20)
        border-1px(rgba(7,17,27,.1))
      .supports
        .supports-item
          padding 16px 12px
          font-size 0
          border-1px(rgba(7,17,27,.1))
          &:last-child
            border-none()
        .icon
          display inline-block
          margin-right 6px
          width 16px
          height 16px
          background-size 100% 100%
          background-repeat no-repeat
          vertical-align top
          &.decrease
            bg-img('decrease_4')
          &.discount
            bg-img('discount_4')
          &.invoice
            bg-img('invoice_4')
          &.guarantee
            bg-img('guarantee_4')
          &.special
            bg-img('special_4')
        .text
          font-size 10px
          line-height 16px
          font-weight 200
          color rgb(7,17,27)
          vertical-align top
    .pisc
      padding 18px
      .title
        margin-bottom 12px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .pic-wrapper
        width 100%
        overflow hidden
        white-space nowrap
        .pic-list
          font-size 0
          .pic-item
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin-right 0
    .info
      padding 18px 18px 0 18px
      color rgb(7,17,27)
      .title
        padding-bottom 12px
        line-height 14px
        font-size 14px
        border-1px(rgba(7,17,27,.1))
      .info-item
        padding 16px 12px
        line-height 16px
        border-1px(rgba(7,17,27,.1))
        font-size 12px
        &:last-child
          border-none()
</style>

<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(item,index) in seller.supports" :key="index" class="supports-item">
                <i class="icon" :class="classMap[seller.supports[index].type]"></i>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="icon-close" @click="hideDetail"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '@components/star/star'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];//特殊图标的动态class处理
    },
    data() {
      return {
        detailShow: false//定义遮罩层的显示隐藏
      }
    },
    methods: {
      showDetail() {//遮罩层的显示
        this.detailShow = true
      },
      hideDetail() {//定义遮罩层的隐藏
        this.detailShow = false
      }
    },
    components: {
      'star': star//星星组件定义
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/mixin'
  .header
    color #fff
    background rgba(7,17,27,.5)
    position relative
    overflow hidden
    .content-wrapper
      padding 24px 12px 18px 24px
      font-size 0
      position relative
      .avatar
        display inline-block
        padding-right 16px
        vertical-align: top;
        img
          border-radius 2px
      .content
        display inline-block
        font-size 14px
        .title
          padding 2px 0 8px 0
          .brand
            display inline-block
            width 30px
            height 18px
            bg-img('brand')
            background-size 30px 18px
            background-repeat no-repeat
            padding-right 6px
          .name
            font-size 16px
            line-height 18px
            font-weight bold
            vertical-align top
        .description
          font-size 12px
          line-height 12px
          padding-bottom 10px
        .supports
          font-size 0
          .icon
            display inline-block
            background-size 100% 100%
            background-repeat no-repeat
            width 12px
            height 12px
            margin-right 4px
            &.decrease
              bg-img('decrease_1')
            &.discount
              bg-img('discount_1')
            &.invoice
              bg-img('invoice_1')
            &.guarantee
              bg-img('guarantee_1')
            &.special
              bg-img('special_1')
          .text
            font-size 10px
            line-height 12px
            vertical-align top
      .support-count
        position absolute
        right 12px
        bottom 14px
        padding 0 8px
        height 24px
        line-height 24px
        border-radius 14px
        background rgba(0,0,0,0.2)
        text-align center
        .count
          font-size 10px
          vertical-align top
        .icon-keyboard_arrow_right
          font-size 10px
          line-height 24px
          padding-left 2px
    .bulletin-wrapper
      position relative
      background-color rgba(27,27,27,.2)
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      .bulletin-title
        display inline-block
        width 22px
        height 12px
        bg-img('bulletin')
        background-size 100% 100%
        background-repeat no-repeat
      .bulletin-text
        font-size 10px
        padding 0 4px
        vertical-align top
      .icon-keyboard_arrow_right
        position absolute
        right  12px
        top 8px
        font-size 10px
    .background
      position absolute
      top 0px
      left 0px
      width 100%
      z-index -1
      filter blur(10px)
    .detail
      position fixed
      top 0px
      left 0px
      z-index 99
      width 100%
      height 100%
      overflow auto
      background rgba(7,17,27,.8)
      backdrop-filter blur(10px)
      -webkit-overflow-scrolling touch
      &::-webkit-scrollbar { width: 0 !important }
      &.fade-enter-active,&.fade-leave-active
        transition: all .5s
      &.fade-enter,&.fade-leave-active
        opacity 0
      .detail-wrapper
        min-height 100%
        width 100%
        .detail-main
          margin-top 64px
          padding-bottom 64px
          .name
            font-size 16px
            line-height 16px
            text-align center
            font-weight 700
          .star-wrapper
            text-align center
            margin-top 18px
            padding 2px 0
          .title
            display flex
            width 80%
            margin 28px auto 24px auto
            .line
              flex 1
              position relative
              top -6px
              border-bottom 1px solid rgba(255,255,255,.2)
            .text
              padding 0 12px
              font-size 14px
              font-weight 700
          .supports
            font-size 0
            width 80%
            margin 0 auto
            .supports-item
              padding 0 12px
              margin-bottom 12px
              &:last-child
                padding-bottom 0
              .icon
                display inline-block
                width 16px
                height 16px
                margin-right 6px
                background-size 100% 100%
                background-repeat no-repeat
                &.decrease
                  bg-img('decrease_2')
                &.discount
                  bg-img('discount_2')
                &.invoice
                  bg-img('invoice_2')
                &.guarantee
                  bg-img('guarantee_2')
                &.special
                  bg-img('special_2')
              .text
                font-size 12px
                line-height 16px
                vertical-align top
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              font-size 12px
              line-height 24px
              text-align justify
      .detail-close
        position relative
        width 32px
        height 32px
        margin -64px auto 0 auto
        clear both
        font-size 32px

</style>

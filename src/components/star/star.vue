<!--  -->
<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :key="itemClass.id" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';
  export default {
    data() {
      return {};
    },
    props: {//接收来自header组件的数据
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {//计算星星组件所用的尺寸，动态赋值class进行渲染
        return 'star-' + this.size
      },
      itemClasses() {//星星计算
        let result = [];
        let score = Math.floor(this.score * 2) / 2;//向下取整计算个数
        let hasDecimal = score % 1 !== 0;//根据取余判断半星是否存在
        let integer = Math.floor(score);//向下取整计算亮星个数
        for (let i = 0; i < integer; i++) {//亮星计算
          result.push(CLS_ON);
        };
        if (hasDecimal) {//半星计算
          result.push(CLS_HALF);
        };
        while (result.length < LENGTH) {//暗星计算
          result.push(CLS_OFF);
        };
        return result
      }
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/mixin'
  .star
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-img('star48_on')
        &.half
          bg-img('star48_half')
        &.off
          bg-img('star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &.last-child
          margin-right 0
        &.on
          bg-img('star36_on')
        &.half
          bg-img('star36_half')
        &.off
          bg-img('star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &.last-child
          margin-right 0
        &.on
          bg-img('star24_on')
        &.half
          bg-img('star24_half')
        &.off
          bg-img('star24_off')

</style>

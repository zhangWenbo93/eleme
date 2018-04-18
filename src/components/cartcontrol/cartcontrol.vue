<!--  -->
<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <!-- 两层结构分为一层控制显示动画，另一层控制隐藏动画  -->
        <!-- <span class="inner icon-remove_circle_outline"></span> -->
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCret"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import Vue from 'vue'; //去给一个观测对象添加一个不存在的字段，直接赋值不行，
  //如果使用Vue.set(),需要引如 import Vue from 'vue'，因为需要Vue这个对象
  //如果使用this.$set(),则不用，因为this.$set()是全局 Vue.set 方法的别名
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        //受现代 JavaScript 的限制 (以及废弃 Object.observe)，Vue 不能检测到对象属性的添加或删除。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化过程，所以属性必须在 data 对象上存在才能让 Vue 转换它，这样才能让它是响应的。
      }
    },
    created() {
      // console.log(this.food)
    },
    methods: {
      addCret(event) { //加操作
        if (!event._constructed) { //防止PC端两次点击
          return;
        }
        // console.log(this.food)
        if (!this.food.count) { //当前food.count不存在时点击置为1
          this.$set(this.food, "count", 1) //count在this.food里是不存在的属性，添加的话就是新属性，要动态添加，Vue 不允许动态添加根级响应式属性。所以采用$set方法，现在this.food就有coun这个属性了
        } else { //否则++
          this.food.count++
        }
        this.$root.drop.$emit('cart.add', event.target)//第一步调用事件触发通过$emit向父组件goods组件及兄弟组件shopcart组件分发事件cart.add
      },
      decreaseCart(event) { //减操作
        if (!event._constructed) { //防止PC端两次点击
          return;
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      transition all 0.4s linear
      // .inner
      display inline-block
      font-size 24px
      line-height 24px
      color rgb(0,160,220)
      opacity 1
      transform translate3d(0,0,0) rotate(0)
      &.move-enter,&.move-leave-active
        opacity 0
        transform translate3d(24px,0,0) rotate(180deg)
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      text-align center
      font-size 10px
      line-height 24px
      color rgb(147,153,159)
    .cart-add
      display inline-block
      padding 6px
      font-size 24px
      line-height 24px
      color rgb(0,160,220)

</style>

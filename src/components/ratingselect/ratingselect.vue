<!--  -->
<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">
        {{desc.positive}}
        <span class="count">{{positive.length}}</span>
      </span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">
        {{desc.negative}}
        <span class="count">{{negative.length}}</span>
      </span>
    </div>
    <div class="switch border-1px" :class="{'on':onlyContent}" @click="toggleContent($event)">
      <i class="icon-check_circle icon"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      selectType: {
        type: Number,//从父组件传入的基础类型，子组件改变不会影响父组件的改变，所以要派发事件告诉父组件
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: "全部",
            positive: "满意",
            negative: "不满意"
          }
        }
      }
    },
    data() {
      return {
        mySelectType: this.selectType,//①创建props属性selectType的副本--mySelectType
        myOnlyContent: this.onlyContent,
      };
    },
    watch: {
      selectType(val) {
        this.mySelectType = val;//②监听外部对props属性selectType的变更，并同步到组件内的data属性mySelectType中
      },
      onlyContent(val) {
        this.myOnlyContent = val;
      },
      mySelectType: function(val) {
        this.$root.drop.$emit('on-type-change', val) //③组件内对myResult变更后向外部发送事件通知
      },
      myOnlyContent: function(val) {
        this.$root.drop.$emit('on-type-content', val) //在组件中，可以使用 $emit, $on, $off 分别来分发、监听、取消监听事件：
      },
    },
    methods: {
      select(type, event) {
        if (!event._constructed) { //阻止浏览器原生click事件，防止PC多次点击
          return;
        };
        this.mySelectType = type;
      },
      toggleContent(event) {
        if (!event._constructed) { //阻止浏览器原生click事件，防止PC多次点击
          return;
        };
        this.myOnlyContent = !this.myOnlyContent;
      }
    },
    computed:{
      positive(){
        return this.ratings.filter((rating)=>{//filter过滤数组里POSITIVE为0的元素,返回总个数
          return rating.rateType === POSITIVE
        })
      },
      negative(){
        return this.ratings.filter((rating)=>{
          return rating.rateType === NEGATIVE
        })
      }
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import '~common/mixin'
  .ratingselect
    .rating-type
      padding 18px 0
      margin  0 18px
      border-1px(rgba(7,17,27,.2))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77,85,93)
        &.active
          color #fff
        .count
          margin-left 2px
          font-size 8px
          line-height 16px
        &.positive
          background rgba(0,160,220,.2)
          &.active
            background rgb(0,160,220)
        &.negative
          background rgba(77,85,93,.2)
          &.active
            background rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      font-size 0
      border-1px(rgba(7,17,27,.1))
      color rgb(147,153,159)
      &.on
        .icon
          color #00c850
      .icon
        display inline-block
        vertical-align top
        font-size 24px
        padding-right 4px
      .text
        display inline-block
        vertical-align top
        font-size 12px

</style>

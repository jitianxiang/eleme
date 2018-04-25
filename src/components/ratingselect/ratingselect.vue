<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span class="block positive" :class="{'active': select_Type === 2}" @click.stop="select(2)">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active': select_Type === 0}" @click.stop="select(0)">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span class="block negative" :class="{'active': select_Type === 1}" @click.stop="select(1)">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':only_Content}" @click.top="toggleContent">
      <i class="iconfont icon-xuanzhong1"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    name: 'ratingselect',
    data() {
      return {
        select_Type: this.selectType,
        only_Content: this.onlyContent
      }
    },
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    components: {},
    computed: {
      positives(){
        return this.ratings.filter((rating)=>{
          return rating.rateType === POSITIVE
        })
      },
      negatives(){
        return this.ratings.filter((rating)=>{
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      select(type) {
        this.select_Type = type
        this.$emit('select', type) //通知父组件
      },
      toggleContent() {
        this.only_Content = !this.only_Content
        this.$emit('toggle', this.only_Content) //通知父组件
      }
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .ratingselect {
    .rating-type {
      padding: .18rem 0;
      margin: 0 .18rem;
      border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
      font-size: 0;

      .block {
        display: inline-block;
        padding: .08rem .12rem;
        margin-right: .08rem;
        border-radius: .01rem;
        color: rgb(77, 85, 93);
        font-size: .12rem;
        line-height: .16rem;
        &.active {
          color: white;
        }
        .count {
          font-size: .08rem;
          margin-left: .02rem;
        }
        &.positive {
          background-color: rgba(0, 160, 220, 0.2);
          &.active {
            background-color: rgb(0, 160, 220);
          }
        }
        &.negative {
          background-color: rgba(77, 85, 93, 0.2);
          &.active {
            background-color: rgb(77, 85, 93);
          }
        }
      }
    }

    .switch {
      padding: .12rem .18rem;
      line-height: .24rem;
      border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
      color: rgb(147, 153, 159);
      font-size: 0;
      &.on {
        i {
          color: #00c850;
        }
      }
      i {
        display: inline-block;
        vertical-align: top;
        margin-right: .04rem;
        font-size: .24rem;
      }
      .text {
        display: inline-block;
        vertical-align: top;
        font-size: .12rem;
      }
    }
  }
</style>

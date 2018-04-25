<template>
  <div class="cartcontroll">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop="decreaseCart">
        <span class="inner iconfont icon-jianhao"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add iconfont icon-jiahao2" @click.stop="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import * as mutationTypes from '../../store/mutations-types'

  export default {
    name: 'cartcontroll',
    data() {
      return {}
    },
    props: {
      food: {
        type: Object
      }
    },
    components: {},
    computed: {},
    methods: {
      addCart(event) {
        this.$store.commit({
          type: mutationTypes.ADD_FOOD,
          uniqueId: this.food.uniqueId
        })
        //向父组件派发自定义的事件
        this.$emit('add', event.target)
      },
      decreaseCart() {
        this.$store.commit({
          type: mutationTypes.DECREASE_CART,
          uniqueId: this.food.uniqueId
        })
      }
    },
    mounted() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .cartcontroll {
    font-size: 0;
    .cart-decrease {
      display: inline-block;
      padding: .06rem;
      transform: translate3D(0, 0, 0);
      opacity: 1;
      .inner {
        line-height: .24rem;
        font-size: .24rem;
        color: rgb(0, 160, 220);
        transition: all 0.4s linear;
        transform: rotate(0);
      }
      &.move-enter-active, &.move-leave-active {
        transition: all 0.4s linear
      }
      &.move-enter, &.move-leave-active {
        opacity: 0;
        transform: translate3d(24px, 0, 0);
        .inner {
          transform: rotate(180deg);
        }
      }
    }

    .cart-count {
      display: inline-block;
      vertical-align: top;
      width: .12rem;
      padding-top: .06rem;
      line-height: .24rem;
      text-align: center;
      font-size: .1rem;
      color: rgb(147, 153, 159);
    }

    .cart-add {
      display: inline-block;
      line-height: .24rem;
      font-size: .24rem;
      padding: .06rem;
      color: rgb(0, 160, 220);
    }
  }
</style>

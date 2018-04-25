<template>
  <div class="shopcart">
    <div class="content" @click.stop="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount > 0}">
            <i class="iconfont icon-gouwuche" :class="{'highlight':totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice > 0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="(ball,index) in balls" :key="index">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click.stop="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,index) in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price * food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click.stop="toggleList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontroll/cartcontroll.vue'
  import BScroll from 'better-scroll'
  import * as mutationTypes from '../../store/mutations-types'

  export default {
    name: 'shopcart',
    data() {
      return {
        balls: [
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true,
        scroll: null
      }
    },
    components: {
      cartcontrol
    },
    computed: {
      deliveryPrice(){
        return this.$store.state.seller.deliveryPrice
      },
      minPrice(){
        return this.$store.state.seller.minPrice
      },
      selectFoods() {
        let select = []
        this.$store.state.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              select.push(food)
            }
          })
        })
        return select
      },
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((item) => {
          total += item.price * item.count
        })
        return total
      },
      totalCount() {
        let count = 0
        this.selectFoods.forEach((item) => {
          count += item.count
        })
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`  //反引号代替字符串拼接
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent)
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      pay() {
        if (this.totalPrice < this.minPrice) {
          return
        }
        window.alert(`支付￥${this.totalPrice}元`)
      },
      empty() {
        this.$store.commit({
          type: mutationTypes.EMPTY_CART
        })
      },
      toggleList() {
        if (!this.totalCount) {
          return false
        }
        this.fold = !this.fold
      },
      drop(target) {
        this.balls.forEach((ball) => {
          if (!ball.show) {
            ball.show = true
            ball.el = target
            this.dropBalls.push(ball)
            return
          }
        })
      },
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) {
        /* 让浏览器重绘 */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .shopcart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 3.6rem;
    height: .48rem;

    .content {
      display: flex;
      background-color: #141d27;
      font-size: 0;

      .content-left {
        flex: 1;

        .logo-wrapper {
          display: inline-block;
          position: relative;
          top: -.1rem; //元素相对自己上移
          margin: 0 .12rem;
          padding: .06rem;
          width: .56rem;
          height: .56rem;
          box-sizing: border-box; //设置宽度后包含padding，border和内容三者之和
          vertical-align: top;
          border-radius: 50%;
          background-color: #141d27;

          .logo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #2b343c;
            text-align: center;
            &.highlight {
              background-color: rgb(0, 160, 220);
            }

            i {
              font-size: .24rem;
              color: #80858a;
              line-height: .4rem;
              &.highlight {
                color: #fff;
              }
            }
          }

          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: .24rem;
            height: .16rem;
            line-height: .16rem;
            text-align: center;
            border-radius: .16rem;
            font-size: .09rem;
            font-weight: 700;
            color: white;
            background-color: rgb(240, 20, 20);
            box-shadow: 0 .04rem .08rem 0 rgba(0, 0, 0, 0.4);
          }
        }

        .price {
          display: inline-block;
          vertical-align: top;
          line-height: .24rem;
          margin-top: .12rem;
          box-sizing: border-box;
          padding-right: .12rem;
          border-right: .01rem solid rgba(255, 255, 255, 0.1);
          font-size: .16rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          &.highlight {
            color: #fff;
          }
        }

        .desc {
          display: inline-block;
          vertical-align: top;
          line-height: .24rem;
          margin: .12rem 0 0 .12rem;
          color: rgba(255, 255, 255, 0.4);
          font-size: .1rem;
        }
      }

      .content-right {
        flex: 0 0 1.05rem;
        width: 1.05rem;

        .pay {
          height: .48rem;
          line-height: .48rem;
          text-align: center;
          font-size: .12rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          background-color: #2b333b;
          &.not-enough {
            background-color: #2b333b;
          }
          &.enough {
            background-color: #00b43c;
            color: white;
          }
        }
      }
    }

    .ball-container {
      .ball {
        position: fixed;
        left: .32rem;
        bottom: .22rem;
        z-index: 200;
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        .inner {
          width: .16rem;
          height: .16rem;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: all 0.4s linear;
        }
      }
    }

    .shopcart-list {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
      transform: translate3d(0, -100%, 0);
      &.fold-enter-active, &.fold-leave-active {
        transition: all 0.5s
      }
      &.fold-enter, &.fold-leave-active {
        transform: translate3d(0, 0, 0)
      }

      .list-header {
        height: .4rem;
        line-height: .4rem;
        padding: 0 .18rem;
        background-color: #f3f5f7;
        border-bottom: .01rem solid rgba(7, 17, 27, 0.1);

        .title {
          float: left;
          font-size: .14rem;
          color: rgb(7, 17, 27);
        }
        .empty {
          float: right;
          font-size: .12rem;
          color: rgb(0, 160, 220);
        }
      }

      .list-content {
        padding: 0 .18rem;
        max-height: 2.17rem;
        background-color: #fff;
        overflow: hidden;

        .food {
          position: relative;
          padding: .12rem 0;
          box-sizing: border-box;
          font-size: 0;
          border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
          .name {
            line-height: .24rem;
            font-size: .14rem;
            color: rgb(7, 17, 27);
          }
          .price {
            position: absolute;
            right: .9rem;
            bottom: .12rem;
            line-height: .24rem;
            font-size: .14rem;
            font-weight: 700;
            color: rgb(240, 27, 27);
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: .06rem;
          }
        }
      }
    }

    .list-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0.48rem;
      width: 100vw;
      z-index: -40;
      filter: blur(.1rem);
      opacity: 1;
      background: rgba(7, 17, 27, 0.6);
      &.fade-enter-active, &.fade-leave-active {
        transition: all 0.5s;
      }
      &.fade-enter, &.fade-leave-active {
        opacity: 0;
        background: rgba(7, 17, 27, 0);
      }
    }

  }
</style>

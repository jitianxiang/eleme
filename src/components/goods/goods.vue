<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" ref="menulisthook" class="menu-item"
            :class="{'current' : currentIndex === index || clickIndex === index}"
            @click='selectMenu(index)' :key="index">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list" ref="foodlisthook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click.stop="showFoodInfo(food)" v-for="(food,index) in item.foods" class="food-item" :key="index">
              <img :src="food.icon"/>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old"
                                                                v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontroll-wrapper">
                  <cartcontroll @add="addFood" :food="food"></cartcontroll>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart.vue'
  import cartcontroll from '../cartcontroll/cartcontroll.vue'
  import * as mutationTypes from '../../store/mutations-types'

  export default {
    name: 'goods',
    data() {
      return {
        goods: [],
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        listHeight: [],
        menuScroll: null,
        foodsScroll: null,
        scrollY: 0,
        isScollStart: false,
        clickIndex: 0
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.$http.get('/api/goods').then((response) => {
        let res = response.body
        if (res.errno === 0) {
          this.goods = res.data
          this.$store.commit({
            type: mutationTypes.SET_GOODS,
            goods: res.data
          })
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },
    components: {
      shopcart,
      cartcontroll
    },
    computed: {
      currentIndex() {
        for (var i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (height2 && (this.scrollY >= height1 && this.scrollY < height2)) {
            if (this.isScollStart && (i === 8 || i === 0)) {
              let menuList = this.$refs.menulisthook
              let el = menuList[i]
              this.menuScroll.scrollToElement(el, 300)
            }
            return i
          }
        }
      }
    },
    methods: {
      showFoodInfo(food) {
        this.$router.push({
          name: 'FoodInfo',
          params: {
            food: food
          }
        })
      },
      addFood(target) {
        this._drop(target)
      },
      _drop(target) {
        /*避免同时开启两个动画行成的卡顿*/
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      selectMenu(index) {
        this.clickIndex = index
        //避开scroll事件监听滚动坐标变化的BUG
        this.scrollY = -1
        let foodList = this.$refs.foodlisthook
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3 //检测实时滚动位置
        })
        this.foodsScroll.on('scroll', (pos) => {
          if (this.isScollStart) {
            this.scrollY = Math.abs(Math.round(pos.y))
          }
        })
        this.foodsScroll.on('scrollStart', () => {
          this.isScollStart = true
          this.clickIndex = -1
        })
        this.foodsScroll.on('scrollEnd', (pos) => {
          this.isScollStart = false
        })
      },
      _calculateHeight() {
        let foodList = this.$refs.foodlisthook
        let height = 0
        this.listHeight.push(height)
        foodList.forEach((item) => {
          height += item.clientHeight
          this.listHeight.push(height)
        })
      }
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import "../../assets/css/constants";

  .goods {
    position: absolute;
    width: 360px;
    height: 100%;
    display: flex;
    overflow: hidden;

    .menu-wrapper {
      flex: 0 0 .8rem;
      width: .8rem;
      height: calc(100vh - 2.22rem);
      background-color: #f3f5f7;

      .menu-item {
        display: table; //适应多行文本的垂直居中
        height: .54rem;
        width: .56rem;
        line-height: .14rem;
        padding: 0 .12rem;

        .icon {
          display: inline-block;
          width: .12rem;
          height: .12rem;
          vertical-align: top;
          margin-right: .02rem;
          background-size: .12rem .12rem;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-image('../../assets/img/decrease_3')
          }
          &.discount {
            @include bg-image('../../assets/img/discount_3')
          }
          &.guarantee {
            @include bg-image('../../assets/img/guarantee_3')
          }
          &.invoice {
            @include bg-image('../../assets/img/invoice_3')
          }
          &.special {
            @include bg-image('../../assets/img/special_3')
          }
        }

        .text {
          display: table-cell;
          width: .56rem;
          vertical-align: middle;
          font-size: .12rem;
          border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
        }
      }

      .current {
        position: relative;
        margin-top: -.01rem;
        z-index: 10;
        background-color: #fff;
        font-weight: 700;
        .text {
          border-bottom: 0;
        }
      }
    }

    .foods-wrapper {
      flex: 1;
      height: calc(100vh - 2.22rem);
      .title {
        padding-left: .14rem;
        height: .26rem;
        line-height: .26rem;
        border-left: .01rem solid #d9dde1;
        font-size: .12rem;
        color: rgb(147, 153, 159);
        background-color: #f3f5f7;
      }

      .food-item {
        display: flex;
        margin: .18rem;
        padding-bottom: .18rem;
        border-bottom: .01rem solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border-bottom: 0;
          margin-bottom: 0;
        }

        img {
          width: .57rem;
          height: .57rem;
          flex-shrink: 0;
          margin-right: .1rem;
        }

        .content {
          position: relative;
          flex: 1;
          .name {
            margin: .02rem 0 .08rem 0;
            height: .14rem;
            line-height: .14rem;
            font-size: .14rem;
            color: rgb(7, 17, 27);
          }

          .desc {
            margin-bottom: .08rem;
            line-height: .12rem;
            font-size: .1rem;
            color: rgb(147, 153, 159);
          }

          .extra {
            line-height: .1rem;
            font-size: .1rem;
            margin-bottom: .08rem;
            color: rgb(147, 153, 159);
            .count {
              margin-right: .12rem;
            }
          }

          .price {
            font-weight: 700;
            line-height: .24rem;
            margin-left: -.02rem;
            font-size: 0;
            .now {
              margin-right: .08rem;
              font-size: .14rem;
              color: rgb(240, 20, 20);
            }
            .old {
              text-decoration: line-through;
              font-size: .1rem;
              color: rgb(147, 153, 159);
            }
          }

          .cartcontroll-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
</style>

<template>
  <transition name="move">
    <div class="food">
      <div class="food-wrapper" ref="food">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image"/>
            <div class="back" @click.stop="goBack">
              <i class="iconfont icon-fanhui"></i>
            </div>
          </div>
          <div class="content">
            <div class="title">{{food.name}}</div>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol @add="addFood" :food="food"></cartcontrol>
            </div>
            <transition name="fade">
              <div class="buy" v-show="!food.count || food.count === 0" @click.stop="addFirst">加入购物车</div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <div class="title">商品介绍</div>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
          </div>
          <ratingselect @select="select" @toggle="toggle" :selectType="selectType" :onlyContent="onlyContent"
                        :desc="desc"
                        :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-if="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings"
                  class="rating-item" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar"/>
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span
                    :class="{'iconfont icon-thumbsup':rating.rateType === 0,'iconfont icon-thumbsup2':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-else>暂无评价</div>
          </div>
        </div>
      </div>
      <shopcart ref="shopcart"></shopcart>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import * as mutationTypes from '../../store/mutations-types'
  import shopcart from '../shopcart/shopcart.vue'
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontroll/cartcontroll.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  import {formatDate} from '../../assets/js/date'

  export default {
    name: 'food',
    data() {
      return {
        ALL: 2,
        POSITIVE: 0,
        NEGATIVE: 1,
        food: this.$route.params.food,
        srcoll: null,
        selectType: 2,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.food, {
          click: true
        })
      })
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {shopcart, cartcontrol, split, ratingselect},
    computed: {},
    methods: {
      goBack() {
        this.$router.back()
      },
      addFirst(event) {
        this.$store.commit({
          type: mutationTypes.ADD_FOOD,
          uniqueId: this.food.uniqueId
        })
        this._drop()
      },
      addFood(event) {
        this._drop()
      },
      _drop() {
        this.$refs.shopcart.drop(event.target)
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === 2) {
          return true
        } else {
          return type === this.selectType
        }
      },
      select(type) {
        this.selectType = type
        this._refreshScroll()
      },
      toggle(onlyContent) {
        this.onlyContent = onlyContent
        this._refreshScroll()
      },
      _refreshScroll() {
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    mounted() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .food {
    position: fixed;
    left: 0;
    top: 0;
    background-color: white;
    width: 100%;
    height: 100%;
    z-index: 30;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
    &.move-enter-active, &.move-leave-active {
      transition: all 0.2s linear;
    }
    &.move-enter, &.move-leave-active {
      transform: translate3d(100%, 0, 0);
    }

    .food-wrapper {
      height: calc(100vh - .48rem);
      .food-content {
        .image-header {
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 100%; //百分比计算基于宽度,达到宽高相等的效果
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .back {
            position: absolute;
            top: .1rem;
            left: 0;
            font-size: 0;
            i {
              display: block;
              padding: .1rem;
              font-size: .2rem;
              color: white;
            }
          }
        }

        .content {
          position: relative;
          padding: .18rem;
          .title {
            line-height: .14rem;
            margin-bottom: .08rem;
            font-size: .14rem;
            font-weight: 700;
            color: rgb(7, 17, 27);
          }

          .detail {
            height: .1rem;
            margin-bottom: .18rem;
            line-height: .1rem;
            font-size: 0;
            .sell-count, .rating {
              font-size: .1rem;
              color: rgb(147, 153, 159);
            }
            .sell-count {
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

          .cartcontrol-wrapper {
            position: absolute;
            right: .12rem;
            bottom: .12rem;
          }

          .buy {
            position: absolute;
            right: .18rem;
            bottom: .18rem;
            z-index: 10;
            height: .24rem;
            line-height: .24rem;
            padding: 0 .12rem;
            box-sizing: border-box;
            font-size: .1rem;
            border-radius: .12rem;
            color: white;
            background-color: rgb(0, 160, 220);
            opacity: 1;
            &.fade-enter-active, &.fade-leave-active {
              transition: all 0.2s;
            }
            &.fade-enter, &.fade-leave-active {
              opacity: 0;
              z-index: -1;
            }
          }
        }

        .info {
          padding: .18rem;
          .title {
            line-height: .14rem;
            margin-bottom: .06rem;
            font-size: .14rem;
            color: rgb(7, 17, 27);
          }

          .text {
            line-height: .24rem;
            padding: 0 .08rem;
            font-size: .12rem;
            color: rgb(77, 85, 93);
          }
        }

        .rating {
          padding-top: .18rem;
          .title {
            line-height: .14rem;
            margin-left: .18rem;
            font-size: .14rem;
            color: rgb(7, 17, 27);
          }
        }

        .rating-wrapper {
          padding: 0 .18rem;
          .rating-item {
            position: relative;
            padding: .16rem 0;
            border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
            .user {
              position: absolute;
              right: 0;
              top: .16rem;
              line-height: .12rem;
              font-size: 0;
              .name {
                display: inline-block;
                margin-right: .06rem;
                vertical-align: top;
                font-size: .1rem;
                color: rgb(147, 153, 159);
              }
              .avatar {
                width: .12rem;
                height: .12rem;
                border-radius: 50%;
              }
            }

            .time {
              margin-right: .06rem;
              line-height: .12rem;
              font-size: .1rem;
              color: rgb(147, 153, 159);
            }

            .text {
              line-height: .16rem;
              font-size: .12rem;
              color: rgb(7, 17, 27);
              .icon-thumbsup, .icon-thumbsup2 {
                line-height: .16rem;
                margin-right: .04rem;
                font-size: .12rem;
              }
              .icon-thumbsup {
                color: rgb(0, 160, 220);
              }
              .icon-thumbsup2 {
                color: rgb(147, 153, 159);
              }
            }
          }

          .no-rating {
            padding: .16rem 0;
            font-size: .12rem;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
</style>

<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
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
        <div class="favorite" @click.stop="toggleFavorite">
          <span class="iconfont icon-icon3" :style="{color:!favorite ? '#d4d6d9' : 'rgb(240, 20, 20)'}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="(item,index) in seller.supports" :index="index">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics">
              <img :src="pic"/>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info,index) in seller.infos" :key="index">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import * as mutationTypes from '../../store/mutations-types'

  export default {
    name: 'seller',
    data() {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        picScroll: null,
        scroll: null,
        favorite: false
      }
    },
    created() {
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {star, split},
    computed: {
      favoriteText() {
        return this.favorite ? '收藏' : '未收藏'
      }
    },
    watch: {
      seller(val) {
        if (val) {
          this._initPicScroll()
        }
      }
    },
    methods: {
      toggleFavorite() {
        this.favorite = !this.favorite
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      },
      _initPicScroll() {
        //给UL设置宽度
        let picWidth = 120
        let margin = 6
        let width = (picWidth + margin) * this.seller.pics.length - margin
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          this.picScroll = new BScroll(this.$refs.picWrapper, {
            scrollX: true,
            eventPassthrough: 'vertical'
          })
          this.picScroll.on('scrollStart', () => {
            this.$store.commit({
              type: mutationTypes.SET_MAINSCROLL_DESTROY,
              status: true
            })
          })
          this.picScroll.on('scrollEnd', () => {
            this.$store.commit({
              type: mutationTypes.SET_MAINSCROLL_DESTROY,
              status: false
            })
          })
        })
      }
    },
    mounted() {
      this._initScroll()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import "../../assets/css/constants";

  .seller {
    position: absolute;
    width: 3.6rem;
    height: 100%;
    overflow: hidden;
    .seller-content {
      .overview {
        padding: .18rem;
        .title {
          margin-bottom: .08rem;
          line-height: .14rem;
          color: rgb(7, 17, 27);
          font-size: .14rem;
        }

        .desc {
          padding-bottom: .18rem;
          font-size: 0;
          border-bottom: .01rem solid rgba(7, 17, 27, 0.1);

          .star {
            display: inline-block;
            vertical-align: top;
            margin-right: .08rem;
          }

          .text {
            display: inline-block;
            line-height: .18rem;
            vertical-align: top;
            margin-right: .12rem;
            font-size: .1rem;
            color: rgb(77, 85, 93);
          }
        }

        .remark {
          display: flex;
          padding-top: .18rem;
          .block {
            flex: 1;
            text-align: center;
            border-right: .01rem solid rgba(7, 17, 27, 0.1);
            &:last-child {
              border: none;
            }
            h2 {
              margin-bottom: .04rem;
              line-height: .1rem;
              font-size: .1rem;
              color: rgb(147, 153, 159);
            }
            .content {
              line-height: .24rem;
              font-size: .1rem;
              color: rgb(7, 17, 27);
              .stress {
                font-size: .24rem;
                font-weight: 200;
              }
            }
          }
        }

        .favorite {
          position: absolute;
          right: .11rem;
          top: .18rem;
          width: .5rem;
          font-size: 0;
          .icon-icon3 {
            display: block;
            margin-bottom: .04rem;
            line-height: .24rem;
            font-size: .24rem;
          }
          .text {
            line-height: .1rem;
            font-size: .1rem;
            color: rgb(77, 85, 93);
          }
        }
      }

      .bulletin {
        padding: .18rem .18rem 0 .18rem;
        .title {
          margin-bottom: .08rem;
          line-height: .14rem;
          color: rgb(7, 17, 27);
          font-size: .14rem;
        }

        .content-wrapper {
          padding: 0 .12rem .16rem .12rem;
          border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
          .content {
            line-height: .24rem;
            font-size: .12rem;
            color: rgb(240, 20, 20);
          }
        }

        .supports {
          .support-item {
            padding: .16rem .12rem;
            border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
            font-size: 0;
            &:last-child {
              border: none;
            }
            .icon {
              display: inline-block;
              width: .16rem;
              height: .16rem;
              vertical-align: top;
              margin-right: .06rem;
              background-size: .16rem .16rem;
              background-repeat: no-repeat;
              &.decrease {
                @include bg-image('../../assets/img/decrease_4')
              }
              &.discount {
                @include bg-image('../../assets/img/discount_4')
              }
              &.guarantee {
                @include bg-image('../../assets/img/guarantee_4')
              }
              &.invoice {
                @include bg-image('../../assets/img/invoice_4')
              }
              &.special {
                @include bg-image('../../assets/img/special_4')
              }
            }

            .text {
              line-height: .16rem;
              font-size: .12rem;
              color: rgb(7, 17, 27);
            }
          }
        }
      }

      .pics {
        padding: .18rem;
        .title {
          margin-bottom: .12rem;
          line-height: .14rem;
          color: rgb(7, 17, 27);
          font-size: .14rem;
        }

        .pic-wrapper {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          .pic-list {
            font-size: 0;
            .pic-item {
              display: inline-block;
              width: 1.2rem;
              height: .9rem;
              margin-right: .06rem;
              &:last-child {
                margin: 0;
              }
              img {
                width: 1.2rem;
                height: .9rem;
              }
            }
          }
        }
      }

      .info {
        padding: .18rem .18rem 0 .18rem;
        .title {
          padding-bottom: .12rem;
          line-height: .14rem;
          color: rgb(7, 17, 27);
          font-size: .14rem;
          border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
        }

        .info-item {
          padding: .16rem .12rem;
          line-height: .16rem;
          border-bottom: .01rem solid rgba(7, 17, 27, 0.1);
          color: rgb(7, 17, 27);
          font-size: .12rem;
          &:last-child {
            border: none;
          }
        }
      }
    }
  }
</style>

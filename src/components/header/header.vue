<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar"/>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}送达</div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>

      </div>
      <div v-if="seller.supports" class="support-count" @click.stop="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="iconfont icon-arrow-right-copy-copy-copy"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click.stop="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="iconfont icon-arrow-right-copy-copy-copy"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar"/>
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper">
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
              <li class="support-item" v-for="(item,index) in seller.supports" :index="index">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
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
        <div class="detail-close" @click.stop="hideDetail">
          <i class="iconfont icon-guanbi"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star'

  export default {
    name: 'v-header',
    data() {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        detailShow: false
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star
    },
    computed: {},
    methods: {
      showDetail() {
        this.detailShow = true
      },
      hideDetail() {
        this.detailShow = false
      }
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' rel="stylesheet/scss" scoped>
  @import "../../assets/css/constants";

  .header {
    position: relative;
    font-size: .2rem;
    color: #fff;
    overflow: hidden;
    background-color: rgba(7, 17, 27, 0.5);

    .content-wrapper {
      position: relative;
      padding: 0.24rem 0.12rem 0.18rem 0.24rem;
      /*消除空白缝隙*/
      font-size: 0;
      .avatar {
        display: inline-block;
        vertical-align: top;
        img {
          width: 0.64rem;
          height: 0.64rem;
          border-radius: 0.02rem;
        }
      }

      .content {
        display: inline-block;
        font-size: .14rem;
        margin-left: .16rem;

        .title {
          margin: 0.02rem 0 0.08rem 0;

          .brand {
            display: inline-block;
            vertical-align: top;
            width: 0.3rem;
            height: 0.18rem;
            @include bg-image('../../assets/img/brand');
            background-size: 0.3rem 0.18rem;
            background-repeat: no-repeat;
          }

          .name {
            margin-left: 0.06rem;
            font-size: 0.16rem;
            line-height: 0.18rem;
            font-weight: bold;
          }
        }

        .description {
          margin-bottom: 0.1rem;
          line-height: 0.12rem;
          font-size: 0.12rem;
        }

        .support {
          .icon {
            display: inline-block;
            vertical-align: top;
            width: 0.12rem;
            height: 0.12rem;
            margin-right: 0.04rem;
            background-size: 0.12rem 0.12rem;
            background-repeat: no-repeat;
            &.decrease {
              @include bg-image('../../assets/img/decrease_1')
            }
            &.discount {
              @include bg-image('../../assets/img/discount_1')
            }
            &.guarantee {
              @include bg-image('../../assets/img/guarantee_1')
            }
            &.invoice {
              @include bg-image('../../assets/img/invoice_1')
            }
            &.special {
              @include bg-image('../../assets/img/special_1')
            }
          }

          .text {
            line-height: 0.12rem;
            font-size: 0.1rem;
          }
        }
      }

      .support-count {
        position: absolute;
        right: 0.12rem;
        bottom: 0.14rem;
        padding: 0 0.08rem;
        height: 0.24rem;
        line-height: 0.24rem;
        border-radius: 0.14rem;
        background-color: rgba(0, 0, 0, 0.2);
        text-align: center;
        .count {
          vertical-align: top;
          font-size: .1rem;
        }
        i {
          margin-left: .02rem;
          font-size: .1rem;
          line-height: .24rem;
        }
      }
    }

    .bulletin-wrapper {
      position: relative;
      height: 0.28rem;
      line-height: .28rem;
      padding: 0 .22rem 0 .12rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: rgba(7, 17, 27, 0.2);

      .bulletin-title {
        display: inline-block;
        vertical-align: top;
        margin-top: .08rem;
        width: .22rem;
        height: .12rem;
        @include bg-image('../../assets/img/bulletin');
        background-size: .22rem .12rem;
        background-repeat: no-repeat;
      }

      .bulletin-text {
        display: inline-block;
        vertical-align: top;
        font-size: .1rem;
        margin: 0 .04rem;
      }

      i {
        position: absolute;
        font-size: .1rem;
        right: .05rem;
      }
    }

    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      //毛玻璃效果
      filter: blur(0.1rem);
      img {
        width: 100%;
        height: 100%;
      }
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
      opacity: 0;
    }

    .detail {
      position: fixed;
      z-index: 100;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      overflow: auto;
      background-color: rgba(7, 17, 27, 0.8);

      .detail-wrapper {
        width: 100%;
        display: inline-block;
        min-height: 100%;
        &.after {
          display: block;
          content: '';
          height: 0;
          line-height: 0;
          clear: both;
          visibility: hidden;
        }

        .detail-main {
          margin-top: .64rem;
          padding-bottom: .64rem;

          .name {
            line-height: .16rem;
            text-align: center;
            font-size: .16rem;
            font-weight: 700;
          }

          .star-wrapper {
            margin-top: .18rem;
            padding: .02rem 0;
            text-align: center;
          }

          .title {
            display: flex;
            width: 80%;
            margin: .28rem auto .24rem auto;

            .line {
              flex: 1; //即flex-shrink：1；flex-grow：1
              position: relative;
              top: -.06rem;
              border-bottom: .01rem solid rgba(255, 255, 255, 0.2);
            }

            .text {
              padding: 0 .12rem;
              font-size: .14rem;
              font-weight: 700;
            }
          }

          .supports {
            width: 80%;
            margin: 0 auto;

            .support-item {
              padding: 0 .12em;
              margin-bottom: .12rem;
              font-size: 0;
              &:last-child {
                margin-bottom: 0;
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
                  @include bg-image('../../assets/img/decrease_2')
                }
                &.discount {
                  @include bg-image('../../assets/img/discount_2')
                }
                &.guarantee {
                  @include bg-image('../../assets/img/guarantee_2')
                }
                &.invoice {
                  @include bg-image('../../assets/img/invoice_2')
                }
                &.special {
                  @include bg-image('../../assets/img/special_2')
                }
              }

              .text {
                line-height: .16rem;
                font-size: .12rem;
              }
            }
          }

          .bulletin {
            width: 80%;
            margin: 0 auto;
            .content {
              padding: 0 .12rem;
              line-height: .24rem;
              font-size: .12rem;
            }
          }
        }
      }

      .detail-close {
        position: relative;
        width: .32rem;
        height: .32rem;
        //margin-top设置负值，让close标签往上提，占据内容区padding-bottom留出的空间
        margin: -.64rem auto 0 auto;
        clear: both;
        font-size: .32rem;
        text-align: center;
      }
    }
  }
</style>

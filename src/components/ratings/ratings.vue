<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @select="select" @toggle="toggle" :selectType="selectType" :onlyContent="onlyContent"
                    :desc="desc"
                    :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" class="rating-item"
              :key="index">
            <img class="avatar" :src="rating.avatar"/>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                <span class="iconfont icon-thumbsup"></span>
                <span class="item" v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  import BScroll from 'better-scroll'
  import star from '../star/star.vue'
  import {formatDate} from '../../assets/js/date'

  export default {
    name: 'ratings',
    data() {
      return {
        ratings: [],
        scroll: null,
        selectType: 2,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
        let res = response.body
        if (res.errno === 0) {
          this.ratings = res.data
          this.$nextTick(() => {
            this._initScroll()
          })
        }
      })
    },
    props: {
      seller: {
        type: Object
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {star, split, ratingselect},
    computed: {},
    methods: {
      _initScroll() {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        })
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
      }
    },
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .ratings {
    position: absolute;
    width: 3.6rem;
    height: 100%;
    overflow: hidden;

    .overview {
      display: flex;
      padding: .18rem 0;
      .overview-left {
        flex: 0 0 1rem;
        width: 1rem;
        border-right: .01rem solid rgba(7, 17, 27, 0.1);
        text-align: center;
        padding: .06rem 0;
        .score {
          line-height: .28rem;
          font-size: .24rem;
          color: rgb(255, 253, 0);
          margin-bottom: .06rem;
        }
        .title {
          line-height: .12rem;
          font-size: .12rem;
          color: rgb(7, 17, 27);
          margin-bottom: .08rem;
        }
        .rank {
          line-height: .1rem;
          font-size: .1rem;
          color: rgb(147, 153, 159);
        }
      }
      .overview-right {
        flex: 1;
        padding: .06rem 0 .06rem .06rem;

        .score-wrapper {
          margin-bottom: .08rem;
          font-size: 0;
          .title {
            display: inline-block;
            line-height: .18rem;
            vertical-align: top;
            font-size: .12rem;
            color: rgb(7, 17, 27);
          }
          .star {
            display: inline-block;
            vertical-align: top;
            margin: 0 .12rem;
          }
          .score {
            display: inline-block;
            line-height: .18rem;
            vertical-align: top;
            font-size: .12rem;
            color: rgb(255, 153, 0);
          }
        }

        .delivery-wrapper {
          font-size: 0;
          .title {
            line-height: .18rem;
            font-size: .12rem;
            color: rgb(7, 17, 27);
          }
          .delivery {
            margin-left: .12rem;
            font-size: .12rem;
            color: #93999f;
          }
        }
      }
    }

    .rating-wrapper {
      padding: 0 .18rem;
      .rating-item {
        display: flex;
        padding: .18rem 0 .05rem 0;
        border-bottom: .01rem solid rgba(7, 17, 27, 0.1);

        .avatar {
          flex: 0 0 .28rem;
          width: .28rem;
          height: .28rem;
          border-radius: 50%;
          margin-right: .12rem;
        }

        .content {
          flex: 1;
          position: relative;
          .name {
            margin-bottom: .04rem;
            line-height: .12rem;
            font-size: .1rem;
            color: rgb(7, 17, 27);
          }

          .star-wrapper {
            margin-bottom: .06rem;
            font-size: 0;
            .star {
              display: inline-block;
              vertical-align: top;
              margin-right: .06rem;
            }
            .delivery {
              display: inline-block;
              vertical-align: top;
              line-height: .12rem;
              font-size: .1rem;
              color: rgb(147, 153, 159);
            }
          }

          .text {
            line-height: .18rem;
            color: rgb(7, 17, 27);
            font-size: .12rem;
            margin-bottom: .08rem;
          }

          .recommend {
            line-height: .16rem;
            font-size: 0;
            .icon-thumbsup, .item {
              display: inline-block;
              margin: 0 .08rem .04rem 0;
              font-size: .09rem;
            }
            .icon-thumbsup {
              color: rgb(0, 160, 220);
            }
            .item {
              padding: 0 .06rem;
              border: .01rem solid rgba(7, 17, 27, 0.1);
              border-radius: .01rem;
              color: rgb(147, 153, 159);
              background-color: white;
            }
          }

          .time {
            position: absolute;
            top: 0;
            right: 0;
            line-height: .12rem;
            font-size: .1rem;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
</style>

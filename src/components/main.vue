<template>
  <div class="main">
    <v-header class="header" :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item" :class="{'highlight': currentPageIndex === 0}" @click.stop="goToPage(0)">商品</div>
      <div class="line" ref="line"></div>
      <div class="tab-item" :class="{'highlight': currentPageIndex === 1}" @click.stop="goToPage(1)">评论</div>
      <div class="tab-item" :class="{'highlight': currentPageIndex === 2}" @click.stop="goToPage(2)">商家</div>
    </div>
    <div class="content" ref="content">
      <div class="content_wrapper" ref="contentWrapper">
        <div class="component_item" v-for="item in componentList" ref="componentItem">
          <!--动态引用组件-->
          <component :is="item" :seller="seller"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './header/header.vue'
  import BScroll from 'better-scroll'
  import goods from './goods/goods.vue'
  import ratings from './ratings/ratings.vue'
  import seller from './seller/seller.vue'
  import * as mutationTypes from '../store/mutations-types'

  export default {
    name: 'v-main',
    data() {
      return {
        seller: {},
        componentList: ['goods', 'ratings', 'seller'],
        scroll: null,
        currentPageIndex: 0
      }
    },
    created() {
      this.$http.get('/api/seller').then((response) => {
        let res = response.body
        if (res.errno === 0) {
          this.seller = res.data
          this.$store.commit({
            type: mutationTypes.SET_SELLER,
            seller: res.data
          })
          this.InitTabScroll()
        }
      })
    },
    components: {
      'v-header': header,
      goods,
      ratings,
      seller
    },
    computed: {
      isMainScrollDestroy() {
        return this.$store.state.mainScrollDestroy
      }
    },
    watch: {
      isMainScrollDestroy(val) {
        if (val) {
          this.scroll.disable()
        } else {
          this.scroll.enable()
        }
      }
    },
    methods: {
      InitTabScroll() {
        //横向滚动必须先计算宽度
        let width = 0
        for (let i = 0; i < this.componentList.length; i++) {
          width += this.$refs.componentItem[0].getBoundingClientRect().width;
        }
        this.$refs.contentWrapper.style.width = width + 'px'
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.content, {
              startX: 0,
              probeType: 3,
              scrollX: true,
              scrollY: false,
              eventPassthrough: 'vertical',
              snap: {
                loop: false,
                threshold: 0.1,
                speed: 800
              },
              bounce: false
            })

            //借用实时监听滑动位置，计算出当前处于page的index值
            this.scroll.on('scroll', (pos) => {
              //控制导航栏下划线跟随下方内容滑动而滑动
              this.$refs.line.style.transform = 'translateX(' + Math.abs(pos.x) / 3 + 'px' + ')'
              this.currentPageIndex = this.scroll.getCurrentPage().pageX
            })
          } else {
            this.scroll.refresh()
          }
        });
      },
      goToPage(index) {
        this.currentPageIndex = index
        this.scroll.goToPage(index)
      }
    },
    mounted() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .highlight {
    color: red;
  }

  .main {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .tab {
      position: relative;
      width: 100%;
      height: .4rem;
      display: flex;

      .tab-item {
        flex: 1;
        text-align: center;
        font-size: .14rem;
        line-height: .4rem;
      }

      .line {
        position: absolute;
        top: .395rem;
        left: 0;
        width: 33.3%;
        height: .005rem;
        background-color: red;
      }
    }

    .content {
      width: 100vw;
      height: calc(100vh - 1.74rem);
      overflow: hidden;
    }

    .content_wrapper {
      display: flex;
      height: 100%;
    }

    .component_item {
      width: 3.6rem;
      flex-shrink: 0;
    }
  }
</style>

import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main'
import Seller from '@/components/seller/seller'
import Goods from '@/components/goods/goods'
import Ratings from '@/components/ratings/ratings'
import FoodInfo from '@/components/food/food'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      // children: [
      //   {
      //     path: '/',
      //     redirect: 'goods'
      //   },
      //   {
      //     path: 'seller',
      //     name: 'Seller',
      //     component: Seller
      //   },
      //   {
      //     path: 'goods',
      //     name: 'Goods',
      //     component: Goods
      //   },
      //   {
      //     path: 'ratings',
      //     name: 'Ratings',
      //     component: Ratings
      //   }]
    },
    {
      path: '/foodInfo',
      name: 'FoodInfo',
      component: FoodInfo
    }
  ]
})

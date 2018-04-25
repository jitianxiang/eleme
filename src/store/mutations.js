import * as mutationTypes from './mutations-types'
import Vue from 'vue'

export default {
  /**
   *改变购物车出现时背景的显示状态
   */
  [mutationTypes.SET_LIST_SHOW](state, payload) {
    state.listShow = payload.status;
  },

  //保存所有食物数据(增加uniqueId属性以便唯一标识)
  [mutationTypes.SET_GOODS](state, payload) {
    payload.goods.forEach((good) => {
      good.foods.forEach((food) => {
        if (!food.uniqueId) {
          Vue.set(food, 'uniqueId', Math.random().toString(36).substr(2))
        }
      })
    })
    state.goods = payload.goods
  },

  //保存所有商家信息
  [mutationTypes.SET_SELLER](state, payload) {
    state.seller = payload.seller
  },

  //增加所选食物
  [mutationTypes.ADD_FOOD](state, payload) {
    state.goods.forEach((good) => {
      good.foods.forEach((food) => {
        if (food.uniqueId === payload.uniqueId) {
          if (!food.count) {
            Vue.set(food, 'count', 1)
          } else {
            food.count++
          }
        }
      })
    })
  },

  //减少所选食物
  [mutationTypes.DECREASE_CART](state, payload) {
    state.goods.forEach((good) => {
      good.foods.forEach((food) => {
        if (food.uniqueId === payload.uniqueId) {
          if (food.count) {
            food.count--
          }
        }
      })
    })
  },

  //清空所选食物
  [mutationTypes.EMPTY_CART](state, payload) {
    state.goods.forEach((good) => {
      good.foods.forEach((food) => {
        if (food.count) {
          food.count = 0
        }
      })
    })
  },

  //销毁主页面的betterscroll
  [mutationTypes.SET_MAINSCROLL_DESTROY](state, payload) {
    state.mainScrollDestroy = payload.status
  },
}

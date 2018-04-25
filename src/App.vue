<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang='scss'>
  //分页器消失
  .slider-pagination {
    display: none;
  }

  html {
    font-size: 100px;
    font-weight: 200;
    #app {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>

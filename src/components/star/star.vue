<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" :index="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'star',
    data() {
      return {}
    },
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    components: {},
    computed: {
      starType() {
        return 'star-' + this.size
      },
      itemClasses() {
        let result = []
        let score = Math.floor(this.score * 2) / 2
        let hasDecimal = score % 1 !== 0
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          result.push('on')
        }
        if (hasDecimal) {
          result.push('half')
        }
        while (result.length < 5) {
          result.push('off')
        }
        return result
      }
    },
    methods: {},
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' rel="stylesheet/css" scoped>
  @import "../../assets/css/constants";

  .star {
    font-size: 0;
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-48 {
      .star-item {
        width: .2rem;
        height: .2rem;
        margin-right: .22rem;
        background-size: .2rem .2rem;
      }
      &:last-child {
        margin-right: 0;
      }
      .on {
        @include bg-image('../../assets/img/star48_on')
      }
      .half {
        @include bg-image('../../assets/img/star48_half')
      }
      .off {
        @include bg-image('../../assets/img/star48_off')
      }
    }
    &.star-36 {
      .star-item {
        width: .15rem;
        height: .15rem;
        margin-right: .16rem;
        background-size: .15rem .15rem;
      }
      &:last-child {
        margin-right: 0;
      }
      .on {
        @include bg-image('../../assets/img/star36_on')
      }
      .half {
        @include bg-image('../../assets/img/star36_half')
      }
      .off {
        @include bg-image('../../assets/img/star36_off')
      }
    }
    &.star-24 {
      .star-item {
        width: .1rem;
        height: .1rem;
        margin-right: .03rem;
        background-size: .1rem .1rem;
      }
      &:last-child {
        margin-right: 0;
      }
      .on {
        @include bg-image('../../assets/img/star24_on')
      }
      .half {
        @include bg-image('../../assets/img/star24_half')
      }
      .off {
        @include bg-image('../../assets/img/star24_off')
      }
    }
  }
</style>

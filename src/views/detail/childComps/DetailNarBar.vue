<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title"> 
        <div v-for="(item,index) in titles" :key="index" class="title-item" :class="{active: index === currentIndex}" @click="titleClick(index)">{{item}}</div>
      </div>
    </nav-bar>
  </div>
</template>

<script>

  import NavBar from "components/common/navbar/NarBar";

  export default {
    name: "DetailNarBar",
     components: {
      NavBar
    },
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        currentIndex: 0
      }
    },
    methods: {
      titleClick(index) {
        this.currentIndex = index;
        this.$emit('titleClick', index);
      },
      backClick() {
        this.$router.back();
      }
    },
  }
</script>

<style scoped>
  .nav-bar {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .title {
    display: flex;
  }
  .title-item {
    flex: 1;
  }
  .active {
    color: pink;
  }
  .back img {
    margin-top: 12px;
  }
</style>
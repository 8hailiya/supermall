<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list/>
    <!-- 底部汇总 -->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NarBar";
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import { mapGetters } from "vuex";

export default {
  name: "Cat",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    //两种用法
    //方法1
    ...mapGetters(["cartLength"]),
    //方法2
    // ...mapGetters({
    //   length: "cartLength",
    // }),
  },
};
</script>

<style scoped>
.cart {
    height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
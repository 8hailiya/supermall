<template>
  <div class="detail">
    <detail-nav-bar @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shopInfo" />
      <detail-goods-info :shop="shopInfo" :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <!-- <toast :message="message" :show="show"/> -->
    <toast ref="toast" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNarBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast"

import { getDetail, Goods, GoodsParam, getRecommend } from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";
import { mapActions } from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shopInfo: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getthemeTopY: null,
      currentIndex: 0,
      // message: '',
      // show: false
    };
  },
  created() {
    //1. 保存传入的iid
    this.iid = this.$route.params.iid;

    //2. 根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      //2.1 获取顶部的图片轮播数据
      const data = res.result;
      // console.log(res);
      this.topImages = data.itemInfo.topImages;

      //2.2 创建商品对象
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //2.3 取出店铺的信息
      this.shopInfo = data.shopInfo;

      //2.4 保存商品的详情数据
      this.detailInfo = data.detailInfo;

      //2.5 获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //2.6 取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      // this.$nextTick(() => {
      //   //拿到数据赋值
      //   this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });

    //3. 请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });

    //4.给getthemeTopY赋值操作进行防抖
    this.getthemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      console.log(this.themeTopYs);
    });
  },

  mounted() {},
  //取消
  destroyed() {
    this.$bus.$off("itemImgLoad", this.itemImgListener);
  },
  methods: {
    ...mapActions({
        addCart: 'addCart'
      }),
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getthemeTopY();
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index]);
    },
    contentScroll(position) {
      //1.获取y值
      const positionY = -position.y;
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // 2.其他做法
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
          // 1.普通做法
          // if((this.currentIndex !== i) && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i;
          //   // console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      //2.是否显示回到顶部
      this.isShowBackTop = -position.y > 1000;
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车中
      // this.$store.cartList.push(product);
      // this.$store.commit('addCart',product);
      // this.$store.dispatch('addCart', product).then(res => {
      // this.show = res;
      // this.message = res;

      // setTimeout(() => {
      //   this.show = false;
      //   this.message = ''
      // },1500)
      // console.log(res);
      //   this.$toast.show(res, 2000)
      // });
      this.addCart(product).then(res => {
        // this.$toast({ message: "加入购物车成功" });
        this.$toast.show(res, 2000)
      });
    },
  },
};
</script>

<style scoped>
.detail {
  position: relative;
  height: 100vh;
  background-color: #fff;
  z-index: 9;
}
.content {
  background-color: #fff;
  height: calc(100% - 44px - 49px);
}
</style>
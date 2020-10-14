<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <tab-control :title="['流行', '新款', '精选']" 
      @tabClick="tabClick" 
      ref="tabControler"
      class="tab-controler" 
      v-show="isTabFixed"/>

    <scroll class="content" 
    ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll"
    :pull-up-load="true"
    @pullingUp="loadMore">

      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends" />
      <feature-view />

      <tab-control :title="['流行', '新款', '精选']" 
      @tabClick="tabClick" 
      ref="tabControl"/>

      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NarBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
// import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { itemListenerMixin, backTopMixin } from "common/mixin";
import { debounce } from "common/utils"

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    // BackTop,
    itemListenerMixin,
    backTopMixin,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      // isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      itemImgListener: null,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  //销毁
  destroyed() {

  },
  //回来
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  //出去
  deactivated() {
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    //2.取消全局事件监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  created() {
    //1.请求多个资源
    this.getHomeMultidata();

    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    //1.图片加载完成的事件监听
    let refresh = debounce(this.$refs.scroll.refresh, 200);
    // 对监听的事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    // 监听中图片加载完成
    this.$bus.$on('itemImageLoad', this.itemImgListener)
     
    //2.获取tabControl的offsetTop
    this.tabOffsetTop = this.$refs.TabControl
  },
  methods: {
    /** 
     * 事件监听相关方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      if ( this.$refs.tabControl !== undefined) {
        this.$refs.tabControl.currentIndex = index;
        this.$refs.tabControler.currentIndex = index;
      }
    },
    // backClick() {
    //   this.$refs.scroll.scrollTo(0, 0)
    // },
    contentScroll(position) {
      //1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000;
      //2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
      // this.$refs.scroll.scroll.refresh()
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    }, 
    /**
     * 网络请求相关方法
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        //解析数组将里面元素一个个加进去
        // console.log(res);
        const newList = res.data.list;
        this.goods[type].list.push(...newList);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
/* scoped:作用域 */
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* 这是在浏览器使用原生滚动时使用，但是在scroll中无效 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;
  overflow: hidden;
}

.tab-controler {
  position: relative;
  background-color: #fff;
  z-index: 99;
}
</style>
import { debounce } from 'common/utils'
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
    }
  },
  mounted() {
    //1.图片加载完成的事件监听
    let refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImgListener = () => {
      refresh()
    }
    //监听
    this.$bus.$on('itemImgLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
  }
}
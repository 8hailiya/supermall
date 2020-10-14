<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button 
      :is-checked="isSelectAll" 
      class="check-button" 
      @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="calculate">
      去计算({{checkLength}})
    </div>

  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
import { mapGetters } from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥'+ this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      // 方法一 需要遍历全部，性能不是很好
      //  if (this.cartList.length === 0) {
      //   return false
      // } else {
      // return !(this.cartList.filter(item => !item.checked).length)}
      // 方法而 只需要找到一个不选中
      if (this.cartList.length === 0) {
        return false
      } else {
        return !this.cartList.find(item => !item.checked)
      }
    },
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach(item => item.checked = false);
      } else {
        // 有部分或全部不选中
        this.cartList.forEach(item => item.checked = true);
      }
    },
    calcClick() {
      if(!this.isSelectAll) {
        this.$toast.show('请选择购买商品',2000)
      }
    }
  }
};
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  /* background-color: #ccc; */
  font-size: 14px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 21px;
  height: 21px;
  text-align: center;
  line-height: 21px;
}
.price {
  margin-left: 30px;
  flex: 1;
}
.calculate {
  width: 100px;
  text-align: center;
  background-color: red;
  color:#fff;
}
</style>
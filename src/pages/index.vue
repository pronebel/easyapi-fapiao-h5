<template>
  <div>
    <div v-if="order === true" class="block">
      <van-cell-group>
        <van-cell v-for="(type) in orderTypeList" :key="type.orderTypeId" :value="type.name" is-link
                  :to="{ path: '/make/out-order', query: { orderType: type.name }}"
                  size="large"/>
      </van-cell-group>
    </div>
    <div class="block">
      <van-cell-group>
        <van-cell title="开票记录" is-link to="/invoice/"/>
        <van-cell title="开票规则" is-link to="/rule"/>
        <van-cell title="抬头管理" is-link :to="{ path: '/company/', params: { from: index }}"/>
      </van-cell-group>
    </div>

    <div v-if="make === true" class="block button">
      <van-button type="info" block to="/make/product">我要开票</van-button>
    </div>
  </div>
</template>
<script>
  import {Indicator} from "mint-ui";
  import {Toast} from "mint-ui";
  import {getOrderTypeList} from "../api/api";
  import {getShopSupport} from "../api/shop";

  export default {
    name: "Index",
    data() {
      return {
        username: "",
        accessToken: "",
        make: "",
        order: "",
        orderTypeList: ""
      };
    },
    methods: {
      //获取发票类型
      getOrderTypeList() {
        getOrderTypeList(this.username).then(res => {
          if (res.status === 200) {
            this.orderTypeList = res.data.content;
            setTimeout(function () {
              Indicator.close();
            }, 1500);
          }
        }).catch(error => {
          console.log(error);
          Indicator.close();
          Toast(error.response.data.message);
        });
      },
      /**
       * 获取发票开票类型
       */
      getShopSupport() {
        getShopSupport(this.username).then(res => {
          if (res.data.content.ifProduct !== false) {
            this.make = res.data.content.ifProduct;
            localStorage.setItem("make", this.make);
          }
          if (res.data.content.ifOrder !== false) {
            this.order = res.data.content.ifOrder;
            localStorage.setItem("order", this.order);
          }
        }).catch(error => {
          console.log(error);
        });
      }
    },
    created() {
      localStorage.removeItem("make");
      localStorage.removeItem("order");
      this.username = this.$route.query.username;
      this.accessToken = this.$route.query.accessToken;
      if (this.accessToken && this.username) {
        localStorage.setItem("accessToken", this.accessToken);
        localStorage.setItem("username", this.username);
        this.$store.state.username = this.$route.query.username;
      } else {
        this.accessToken = localStorage.getItem("accessToken");
        this.username = localStorage.getItem("username");
        if (!this.accessToken || !this.username) {
          this.$router.push("/error");
        }
      }
    },
    mounted() {
      let that = this;
      Indicator.open({
        text: "加载中...",
        spinnerType: "fading-circle"
      });
      that.getOrderTypeList();
      setTimeout(function () {
        that.getShopSupport();
      }, 1000);
    }
  };
</script>

<style scoped>
  .block {
    margin: 10px 0 0 0;
  }

  .button {
    padding: 5px 20px;
  }
</style>

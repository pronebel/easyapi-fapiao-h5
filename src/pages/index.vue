<template>
  <div class="body">
    <div class="page-cell">
      <div v-if="order === true" style="margin-top:10px;">
        <div style="border-bottom:1px solid #f4f4f4;" v-for="(type, index) in typeList" :key="index">
          <div class="mint-cell router-link">
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title" @click="goMakeInvoice('order', type.name)">
                <span class="mint-cell-text">{{ type.name }}</span>
              </div>
              <i class="mint-cell-allow-right"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="invoice-record" style="margin-top:10px;">
        <a @click="goInvoiceRecord" class="mint-cell">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title"><span class="mint-cell-text">开票记录</span></div>
            <i class="mint-cell-allow-right"></i>
          </div>
        </a>
        <a href="/rule" class="mint-cell">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title"><span class="mint-cell-text">开票规则</span></div>
            <i class="mint-cell-allow-right"></i>
          </div>
        </a>
        <a href="javascript:void(0);" @click="gotoCompany" class="mint-cell">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title"><span class="mint-cell-text">抬头管理</span></div>
            <i class="mint-cell-allow-right"></i>
          </div>
        </a>
      </div>
      <div class="mint-btn" v-if="make === true">
        <div class="mint-cell-title" @click="goMakeInvoice('product', '')">
          <span class="mint-cell-text">我要开票</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {Indicator} from "mint-ui";
  import {Toast} from "mint-ui";
  import {getOrderTypeList} from "../api/api";
  import {getShopSupport} from "../api/shop";

  export default {
    name: "App",
    data() {
      return {
        username: "",
        checkItem: [],
        invoiceRecordList: [],
        addressList: [],
        accessToken: "",
        make: "",
        order: "",
        appKey: "",
        typeList: ""
      };
    },
    methods: {
      //获取发票类型
      getOrderTypeList() {
        getOrderTypeList(this.username).then(res => {
          if (res.status === 200) {
            this.typeList = res.data.content;
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
      goMakeInvoice(pl, orderType) {
        if (pl === "product") {
          this.$router.push({path: "/product"});
        } else if (pl === "order") {
          localStorage.setItem("orderType", orderType);
          this.$router.push("/out-order");
        }
      },
      goInvoiceRecord() {
        this.$router.push("/record");
      },
      gotoCompany() {
        this.$router.push({
          path: "/company/",
          name: "company",
          params: {
            from: "index"
          }
        });
      },
      //获取发票类型
      getInvoiceType() {
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
      this.appKey = this.$route.query.appKey;
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
        that.getInvoiceType();
      }, 1000);
    }
  };
</script>

<style scoped>
  .mint-cell-text {
    font-size: 16px;
  }

  .mint-cell-wrapper {
    background: none !important;
    position: relative;
  }

  .invoice-record a {
    border-bottom: 1px solid #f4f4f4;
  }

  .mint-btn {
    margin: 20px;
    height: 44px;
    background-color: #52c9f5;
    border-radius: 8px;
    box-shadow: 0px 3px 15px 0px rgba(12, 143, 192, 0.23);
    color: #fff;
    text-align: center;
    line-height: 44px;
    font-size: 16px;
  }
</style>

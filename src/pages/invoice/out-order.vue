<template>
  <div class="associated-con">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="order-con address-con header-d address-bottom" v-for="(item,index) in invoiceItems" :key="index">
      <van-cell-group :border="false">
        <van-cell title="税收编码：" :value="item.no" :border="false"/>
        <van-cell title="商品名称：" :value="item.name" :border="false"/>
        <van-cell title="规格：" :value="item.model" :border="false"/>
        <van-cell title="单位：" :value="item.unit" :border="false"/>
        <van-cell title="单价：" :value="item.price" :border="false"/>
        <van-cell title="数量：" :value="item.number" :border="false"/>
        <div>
          <span class="price">￥{{ item.price * item.number }}</span>
          <span class="time">小计</span>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  import Header from "../../components/header.vue";

  export default {
    name: "OutOrder",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: "发票明细",
        id: "",
        invoiceItems: "",
        serviceType: ""
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getInvoiceDetails() {
        this.id = this.$route.query.id;
        this.$ajax.get("/api/invoice/record/" + this.id, {
          params: {
            accessToken: localStorage.getItem("accessToken"),
            size: 500
          }
        }).then(res => {
          this.invoiceItems = res.data.content.invoiceItems;
          this.serviceType = res.data.content.serviceType;
        }).catch(error => {
          console.log(error);
        });
      }
    },
    watch: {},
    created() {
      this.id = this.$route.query.id;
    },
    mounted() {
      this.getInvoiceDetails();
    }
  };
</script>

<style scoped>
  @import 'out-order.css';
</style>

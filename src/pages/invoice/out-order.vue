<template>
  <div class="associated-con">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="order-con header-d" v-for="(item,index) in invoiceItems" :key="index">
      <div class="page-part">
        <a class="mint-cell">
          <div class="mint-cell-wrapper">
            <div class="order-right">
              <!--<p class="num" v-if="this.serviceType===订单开票"><span>订单编号：</span><span>{{item.outOrderNo}}</span></p>-->
              <p class="num">
                <span>税收编码：</span><span>{{ item.no }}</span>
              </p>
              <p class="name">
                <span>商品名称：</span><span>{{ item.name }}</span>
              </p>
              <p class="remark">
                <span>规格：</span><span>{{ item.model }}</span>
              </p>
              <p class="remark">
                <span>单位：</span><span>{{ item.unit }}</span>
              </p>
              <p class="remark">
                <span>单价：</span><span>￥{{ item.price }}</span>
              </p>
              <p class="remark">
                <span>数量：</span><span>{{ item.number }}</span>
              </p>
              <p>
                <span class="price">￥{{ item.price * item.number }}</span
                ><span class="time">小计</span>
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from "../../components/header.vue";

  export default {
    name: "out-order",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: "发票内容详情",
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

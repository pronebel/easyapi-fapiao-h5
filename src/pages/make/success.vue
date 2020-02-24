<template>
  <div class="con">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="success-con">
      <div>
        <p><img src="../../assets/images/success.png" alt=""/></p>
      </div>
      <div class="success-button">
        <div>
          <span @click="toInvoice" class="button">返回首页</span>
        </div>
        <div>
          <mt-button @click="toInvoiceRecord" class="button1">开票记录</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from "../../components/header.vue";

  export default {
    name: "make-success",
    components: {
      Header: Header
    },
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
        headerTitle: "提交成功",
      };
    },

    methods: {
      goBack() {
        history.go(-1);
      },
      toInvoiceRecord() {
        this.$router.push(`/record`);
      },
      toInvoice() {
        this.$router.push({
          path: "/",
          query: {
            username: localStorage.getItem("username"),
            accessToken: localStorage.getItem("accessToken")
          }
        });
      }
    },
    created() {
    }
  };
</script>

<style scoped>
  @import 'success.css';
</style>

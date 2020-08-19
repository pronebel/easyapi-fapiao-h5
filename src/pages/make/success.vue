<template>
  <div class="con">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="success-con">
      <div>
        <p><img src="../../assets/images/success.png" alt=""/></p>
      </div>
      <div class="success-button">
        <div>
          <span @click="gotoInvoice" class="button">返回首页</span>
        </div>
        <div>
          <mt-button @click="gotoInvoiceRecord" class="button1">开票记录</mt-button>
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
        headerTitle: "提交成功",
      };
    },

    methods: {
      goBack() {
        history.go(-1);
      },
      gotoInvoiceRecord() {
        this.$router.push(`/record`);
      },
      gotoInvoice() {
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

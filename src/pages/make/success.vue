<template>
  <div class="con">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="success-con">
      <div>
        <p><img src="../../assets/images/success.png" alt="" /></p>
      </div>
      <div class="success-button">
        <div>
          <span @click="toInvoice" class="button">返回首页</span>
        </div>
        <div>
          <mt-button @click="toInvoiceRecord" class="button1"
            >开票记录</mt-button
          >
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
      username: "",
      accessToken: ""
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
        query: { username: this.username, accessToken: this.accessToken }
      });
    }
  },
  created() {
    this.accessToken = localStorage.getItem("accessToken");
    this.username = localStorage.getItem("username");
  }
};
</script>

<style scoped>
.success-con {
  margin-top: 120px;
  text-align: center;
  padding: 0 10px;
}

.success-button {
  margin-top: 50px;
}

.success-button div {
  width: 50%;
  float: left;
}

.success-button div .button {
  display: block;
  width: 88%;
  padding: 7px;
  border: 1px solid #56cbf6;
  border-radius: 10px;
  color: #4faeec;
  font-size: 18px;
  cursor: pointer;
}

.success-button div .button:active {
  background: #b8bbbf;
}

.success-button div .button1 {
  width: 95%;
  padding: 10px;
  background: #4faeec;
  border-radius: 10px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

/*.success-button span input:hover{*/
/*background: #56cbf6;*/
/*color: #fff;*/
/*}*/
</style>

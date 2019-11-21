<template>
  <div class="con">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="success-con">
      <div>
        <p><img src="../../assets/images/success.png" alt=""></p>
      </div>
      <div class="success-button">
        <div>
          <span @click="toInvoice" class="button">返 回</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../../components/header.vue'

  export default {
    name: "make-success",
    components: {
      'Header': Header
    },
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
        headerTitle: '提交成功',
        username: '',
        accessToken: '',
      };
    },

    methods: {
      goBack() {
        history.go(-1);
      },
      toInvoice() {
        let returnUrl = localStorage.getItem('returnUrl');
        console.log(returnUrl);
        if (returnUrl.indexOf('backwxurl')!==-1){
          wx.miniProgram.navigateBack(-1)
        }else {
          window.location.href = returnUrl;
        }
      }
    },
    created() {
      this.accessToken = localStorage.getItem('accessToken');
      this.username = localStorage.getItem('username');
    },
  }
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

  .success-button div .button {
    padding: 5px 50px;
    border: 1px solid #56cbf6;
    border-radius: 10px;
    color: #4faeec;
    font-size: 18px;
    cursor: pointer;
  }

  .success-button div .button:active {
    background: #b8bbbf;
  }
</style>

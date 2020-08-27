<template>
  <div class="success">
    <van-icon name="checked" color="#19be6b" size="120"/>
    <div class="success-button">
      <van-button type="default" plain block round @click="back">返 回</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MakeSuccess",
    data() {
      return {};
    },
    methods: {
      back() {
        let returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          if (returnUrl.indexOf("backwxurl") !== -1) {
            wx.miniProgram.navigateBack(-1);
          } else {
            window.location.href = returnUrl;
          }
        }
      }
    }
  };
</script>

<style scoped>
  @import 'success.css';
</style>

<template>
  <div class="con">
    <div class="success-con">
      <div>
        <p><img src="../../assets/images/success.png" alt=""/></p>
      </div>
      <div class="success-button">
        <div>
          <span @click="back" class="button">返 回</span>
        </div>
      </div>
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
        if (returnUrl.indexOf("backwxurl") !== -1) {
          wx.miniProgram.navigateBack(-1);
        } else {
          window.location.href = returnUrl;
        }
      }
    }
  };
</script>

<style scoped>
  @import 'success.css';
</style>

<template>
  <div class="error">
    <div class="error-con">
      <p>
        <img src="../../static/images/error.png" alt/>
      </p>
      <div class="text">
        <p style="font-size: 14px">信息错误</p>
        <p style="color: #666;">请重新进入</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "errorPage"
  };
</script>

<style scoped>
  .error {
    display: flex;
    justify-content: center; /*x轴对齐方式*/
    align-items: center; /*y轴对滴方式*/
    height: 100%; /**屏幕高度百分百*/
  }

  .error-con {
    flex: 0;
    margin-top: 200px;
  }

  .text {
    text-align: center;
    margin-left: -20px;
  }
</style>

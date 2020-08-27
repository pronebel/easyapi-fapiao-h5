<template>
  <div class="error">
    <div>
      <van-icon name="clear" color="#ed4014" size="120"/>
      <div class="text">
        <p style="font-size: 14px">信息错误</p>
        <p style="color: #666;">请重新进入</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Error"
  };
</script>

<style scoped>
  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex: 0;
    margin-top: 200px;
  }

  .text {
    margin-top: 10px;
    text-align: center;
  }
</style>

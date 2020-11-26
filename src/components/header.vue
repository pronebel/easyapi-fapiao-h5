<template>
  <header>
    <van-nav-bar
      :title="headerTitle"
      left-arrow
      @click-left="goBack()"
    />
  </header>
</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
      };
    },
    props: {
      headerTitle: {
        type: String,
        default: null
      }
    },
    methods: {
      goBack() {
        this.$emit("head-back");
      }
    },
    mounted() {
    }
  };
</script>

<style scoped>
  .header {
    background: #ffffff !important;
    color: #000;
    height: 50px;
    line-height: 50px;
    font-size: 18px !important;
  }
</style>

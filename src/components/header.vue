<template>
  <header class="mint-header is-fixed header">
    <div class="mint-header-button is-left">
      <a @click="goBack()" class="router-link-active">
        <button class="mint-button mint-button--default mint-button--normal">
          <span class="mint-button-icon"
          ><i class="mintui mintui-back"></i
          ></span>
          <label class="mint-button-text"></label>
        </button>
      </a>
    </div>
    <h1 class="mint-header-title">{{ headerTitle }}</h1>
    <div class="mint-header-button is-right"></div>
  </header>
</template>

<script>
  export default {
    name: "Header",
    data() {
      return {};
    },
    props: {
      headerTitle: {
        type: String,
        default: null
      }
    },
    methods: {
      goBack() {
        this.$emit("headBack");
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

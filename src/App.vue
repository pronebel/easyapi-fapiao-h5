<template>
  <div id="app">
    <keep-alive>
      <router-view v-wechat-title="$route.meta.title"/>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: "App",
    methods: {}
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0 !important;
  }
</style>

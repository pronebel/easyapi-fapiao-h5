<template>
  <div id="app">
    <transition>
      <keep-alive>
        <router-view v-wechat-title="$route.meta.title" v-if="$route.meta.keepAlive"/>
      </keep-alive>
    </transition>
    <transition>
      <router-view v-wechat-title="$route.meta.title" v-if="!$route.meta.keepAlive"/>
    </transition>
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

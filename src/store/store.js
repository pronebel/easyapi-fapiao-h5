import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  // 定义状态
  state: {
    username: localStorage.getItem("username"),
    ifShowH5NavBar: false //是否隐藏顶部
  },
  mutations: {}
});

export default store;

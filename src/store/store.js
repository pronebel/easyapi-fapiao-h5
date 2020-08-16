import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  // 定义状态
  state: {
    author: "我是store里的内容",
    userType: null,
    username: localStorage.getItem("username"),
    ifShowH5NavBar:true
  },
  //改变转台操作
  mutations: {
    changeAdmin(state) {
      state.userType = 0;
    },
    changeUser(state) {
      state.userType = 1;
    }
  }
});

export default store;

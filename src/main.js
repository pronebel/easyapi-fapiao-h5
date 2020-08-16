import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuex from "vuex";
import Mint from "mint-ui";
import "mint-ui/lib/style.css";
import "./assets/css/common.css";
import store from "./store/store";
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'


import axios from './api/request'
Vue.prototype.$ajax = axios

Vue.use(MintUI);

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Mint);
Vue.use(require("vue-wechat-title"));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title === undefined ? "开具发票" : to.meta.title;
  }
  next();
});

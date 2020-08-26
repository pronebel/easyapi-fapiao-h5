import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuex from "vuex";
import Mint from "mint-ui";
import "mint-ui/lib/style.css";
import Vant from 'vant';
import 'vant/lib/index.css';
import "./assets/css/common.css";
import store from "./store/store";
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css';
import clipboard from 'clipboard';
import { InfiniteScroll } from 'mint-ui';
import VueWechatTitle from 'vue-wechat-title'


import axios from './api/request'
Vue.prototype.$ajax = axios

Vue.use(InfiniteScroll);
Vue.use(MintUI);
Vue.use(Vant);
Vue.prototype.clipboard = clipboard;
Vue.use(VueWechatTitle)

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

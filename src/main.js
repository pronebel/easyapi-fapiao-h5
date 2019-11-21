// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import axios from 'axios'  //http.js文件，即全局配置axios请求，与main.js在同级目录
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import './assets/css/common.css'
import store from './vuex/store'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(Mint)
Vue.use(require('vue-wechat-title'))
// Vue.prototype.$http = axios
Vue.prototype.$ajax = axios;

/* eslint-disable no-new */

axios.defaults.baseURL = 'https://fapiao-api.easyapi.com';

//拦截器  请求----------------
axios.interceptors.request.use(function (config) {
  //获取token
  let token = localStorage.getItem('accessToken');
  let taxNumber = localStorage.getItem('taxNumber');
  if (config.params) {
    config.params.accessToken = token;
    //config.params.taxNumber = taxNumber;
  }
  if (config.data) {
    config.data.accessToken = token;
    //config.data.taxNumber = taxNumber;
  }
  if (!token) {
    router.push(`/error`);
  }
  return config;
}, function (error) {
  console.log(error)
  // 对请求错误做些什么
  //iView.Message.success("请求出错了")
  return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {

  if (response.status == 204) {
    // 处理204返回内容为空
    console.log(204);
  }
  return response;

}, function (error) {
  // 对响应错误做点什么
  console.log(error)
  if (error.response.data.code == -9) {
    // 处理-9用户信息不存在
    router.push(`/error`);
    // window.location.href = "https://account-service-web.easyapi.com";
  } else if (error.response.data.code == -7) {
    // 处理-7认证失败
    router.push(`/error`);
    // window.location.href = "https://account-service-web.easyapi.com";
  } else {
    return Promise.reject(error);
  }
});
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title === undefined ? '开具发票' : to.meta.title
  }
  next()
});

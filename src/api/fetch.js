import axios from 'axios'
import router from "../router";

axios.defaults.baseURL = "https://fapiao-api.easyapi.com";

//拦截器  请求----------------
axios.interceptors.request.use(
  function (config) {
    let accessToken = localStorage.getItem("accessToken");
    let taxNumber = localStorage.getItem("taxNumber");
    if (config.params) {
      config.params.accessToken = accessToken;
    }
    if (config.data) {
      config.data.accessToken = accessToken;
    }
    if (!accessToken) {
      router.push(`/error`);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    if (response.status == 204) {
    }
    return response;
  },
  function (error) {
    if (error.response.data.code == -9) {
      router.push(`/error`);
    } else if (error.response.data.code == -7) {
      router.push(`/error`);
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios
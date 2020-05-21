import axios from 'axios'

import {baseUrl} from "request";


/**
 * 获取订单类型列表
 */
export const getOrderTypeList = (username) => axios.get(`https://fapiao-api.easyapi.com/order-types`, {
  params: {
    username: username,
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 获取外部订单列表
 */
export const getOutOrders = (id, params) => axios.get(`https://fapiao-api.easyapi.com/out-orders`, {
  params: {
    params,
    size: this.size,
    taxNumber: localStorage.getItem("taxNumber"),
    username: this.username,
    state: 0,
    accessToken: localStorage.getItem("accessToken")
  }
});

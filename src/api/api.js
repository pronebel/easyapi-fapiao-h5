import axios from 'axios'

import {baseUrl} from "./request";


/**
 * 获取订单类型列表
 */
export const getOrderTypeList = () => axios.get(`${baseUrl}/order-types`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 获取外部订单列表
 */
export const getOutOrders = (id, params) => axios.get(`${baseUrl}/out-orders`, {
  params: {
    params,
    size: this.size,
    taxNumber: localStorage.getItem("taxNumber"),
    username: this.username,
    state: 0,
    accessToken: localStorage.getItem("accessToken")
  }
});

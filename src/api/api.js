import axios from "axios";

export const baseUrl = "https://fapiao-api.easyapi.com";

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
    accessToken: localStorage.getItem("accessToken"),
  }
});

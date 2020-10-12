import axios from 'axios'

import {baseUrl} from "./request";

/**
 * 获取未开票外部订单列表
 *
 * @see https://www.easyai.com
 */
export const getOutOrderList = (params, page) => {
  params.size = page.size;
  params.page = page.page;
  params.state = 0;
  params.sort = "orderTime,desc";
  params.accessToken = localStorage.getItem("accessToken");
  return axios.get(`${baseUrl}/out-orders`, {
    params: params
  });
};

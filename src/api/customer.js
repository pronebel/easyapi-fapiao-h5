import axios from 'axios'

import {baseUrl} from "./request";

/**
 * 获取我的客户信息
 *
 * @see https://www.easyai.com
 */
export const getCustomer = (params) => axios.get(`${baseUrl}/customer`, {
  params: {
    ...params,
    accessToken: localStorage.getItem("accessToken")
  }
});

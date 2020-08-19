import axios from 'axios'

import {baseUrl} from "./request";

/**
 * 查询客户服务器订单信息
 *
 * @see https://www.easyai.com
 */
export const queryShopOrder = (outOrderNo, username) => axios.get(`${baseUrl}/shop-order/${outOrderNo}/query`, {
  params: {
    accessToken: localStorage.getItem("accessToken"),
    username: username
  }
});


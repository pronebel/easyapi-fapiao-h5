import axios from 'axios'

import {baseUrl} from "./request";


/**
 * 获取商户支持信息
 *
 * @see https://www.easyai.com
 */
export const getShopSupport = () => axios.get(`${baseUrl}/api/shop/0/support`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 获取商户详情信息
 * @see https://www.easyai.com
 */
export const getShop = () => axios.get(`${baseUrl}/api/shop`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


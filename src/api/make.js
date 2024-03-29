import axios from 'axios'

import {baseUrl} from "../utils/request";

/**
 * 开具发票
 *
 * @see https://www.easyai.com
 */
export const makeInvoice = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  return axios.post(`${baseUrl}/invoice/make`, data);
};


/**
 * 合并外部订单开具发票
 *
 * @see https://www.easyai.com
 */
export const mergeMakeInvoice = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  return axios.post(`${baseUrl}/merge-make`, data);
};


/**
 * 大类开具发票
 *
 * @see https://www.easyai.com
 */
export const categoryMakeInvoice = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  data.taxNumber = localStorage.getItem("taxNumber")
  return axios.post(`${baseUrl}/invoice/category/make`, data);
};


/**
 * 商品明细开具发票
 *
 * @see https://www.easyai.com
 */
export const productMakeInvoice = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  return axios.post(`${baseUrl}/invoice/product/make`, data);
};

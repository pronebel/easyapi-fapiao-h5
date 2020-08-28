import axios from 'axios'

import {baseUrl} from "./request";


/**
 * 获取发票列表
 *
 * @see https://www.easyai.com
 */
export const getInvoiceList = (params) => axios.get(`${baseUrl}/api/invoice/records`, {
  params: params
});

/**
 * 获取发票详情信息
 *
 * @see https://www.easyai.com
 */
export const getInvoice = (id) => {
  let params = {};
  params.accessToken = localStorage.getItem("accessToken")
  return axios.get(`${baseUrl}/api/invoice/record/${id}`, {
    params: params
  });
}


/**
 * 查询发票信息
 *
 * @see https://www.easyai.com
 */
export const queryInvoice = (outOrderNo) => {
  let params = {};
  params.accessToken = localStorage.getItem("accessToken")
  return axios.get(`${baseUrl}/invoice/${outOrderNo}/query`, {
    params: params
  });
}

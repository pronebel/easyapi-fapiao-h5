import axios from 'axios'

import {baseUrl} from "../utils/request";


/**
 * 获取地址列表
 *
 * @see https://www.easyai.com
 */
export const getAddressList = (params) => axios.get(`${baseUrl}/addresses`, {
  params: {
    ...params,
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 获取地址信息
 *
 * @see https://www.easyai.com
 */
export const getAddress = (id) => axios.get(`${baseUrl}/address/${id}`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 添加地址信息
 **
 * @see https://www.easyai.com
 */
export const createAddress = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  data.ifDefault = true
  return axios.post(`${baseUrl}/address`, data);
};

/**
 * 修改地址信息
 *
 * @see https://www.easyai.com
 */
export const updateAddress = (id, data) => {
  data.accessToken = localStorage.getItem("accessToken")
  data.ifDefault = true
  return axios.put(`${baseUrl}/address/${id}`, data);
};

/**
 * 删除地址信息
 *
 * @see https://www.easyai.com
 */
export const deleteAddress = id => axios.delete(`${baseUrl}/address/${id}`, {
  data: {
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 获取我的默认地址信息
 */
export const getDefaultAddress = username => axios.get(`${baseUrl}/address/${username}/default`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 设置为默认地址
 *
 * @see https://www.easyai.com
 */
export const defaultAddress = id => axios.put(`${baseUrl}/address/${id}`, {
  accessToken: localStorage.getItem("accessToken"),
  ifDefault: true
});

import axios from 'axios'


/**
 * 获取商品列表
 *
 * @see https://www.easyai.com
 */
export const getProductList = (params) => axios.get(`/products`, {
  params: {
    params,
    accessToken: localStorage.getItem("accessToken")
  }
});

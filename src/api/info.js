import {baseUrl, axios} from "request";


/**
 * 获取开票规则
 *
 * @see https://www.easyai.com
 */
export const getProductList = (params) => axios.get(`${baseUrl}/products`, {
  params: {
    params,
    accessToken: localStorage.getItem("accessToken")
  }
});

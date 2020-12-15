import axios from 'axios'

import {baseUrl} from "../utils/request";

/**
 * 获取开票规则
 *
 * @see https://www.easyai.com
 */
export const getRule = () => axios.get(`${baseUrl}/api/invoice/rule`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

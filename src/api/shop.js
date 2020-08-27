import axios from 'axios'

import {baseUrl} from "./request";


/**
 *
 * @see https://www.easyai.com
 */
export const getShopSupport = (username) => axios.get(`${baseUrl}/api/shop/0/support`, {
  params: {
    accessToken: localStorage.getItem("accessToken"),
    username: username
  }
});


/**
 *
 * @see https://www.easyai.com
 */
export const getShop = () => axios.get(`${baseUrl}/api/shop`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


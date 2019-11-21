//基本地址

import axios from 'axios'

const instance = axios.create({
  baseURL: "https://fapiao-api.easyapi.com",
})

export default instance

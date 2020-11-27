import axios from 'axios'

/**
 * 获取七牛KEY
 */
export const getQiniuKey = () => axios.get(`http://api2.easyapi.com/qiniu/key`);


/**
 * 获取七牛空间TOKEN
 */
export const getQiniuToken = () => axios.get(`http://api2.easyapi.com/qiniu/upToken`);

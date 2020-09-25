/**
 * @Date: 2020-09-24 11:14:16
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-24 15:47:55
 * @FilePath: \datax-web-ui\src\simulateAPI\simulateAPI.js
 * @Description: 模拟登录Apache Atlas
 */

// import request from '@/utils/request'
import axios from 'axios';
import qs from 'qs';

/**
 * @description: 模拟登陆发送post
 * @param {object} account
 * @return {object} axios返回信息
 */
export async function simulatePostAccount(account) {
  // return request({
  //   url: 'http://123.56.96.151:8079/j_spring_security_check',
  //   method: 'post',
  //   data: account
  // })
  const res = await axios({
    url: '/j_spring_security_check',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cache-control': 'no-cache'
    },
    data: qs.stringify(account),
    withCredentials: true
  }).catch(err => console.log(err));
  return res;
}

/**
 * @description: 模拟登录向session接口get
 * @param {string} pageSrc 跳转的src
 * @return {object} axios返回信息
 */
export async function simulateRedirect(pageSrc) {
  const res = await axios({
    url: '/session',
    method: 'get'
  })
    .then(() => {
      window.location.replace(pageSrc);
    })
    .catch(err => console.log(err));
  return res;
}

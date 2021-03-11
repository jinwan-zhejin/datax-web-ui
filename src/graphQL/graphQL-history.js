/**
 * @Date: 2021-03-08 15:58:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-03-11 17:59:59
 * @FilePath: \datax-web-ui\src\graphQL\graphQL-history.js
 * @Description: graphQL-history
 */

import request from '@/utils/request'

/**
 * @description: 获取历史结果
 * @return {Promise}
 */
export function getResultHistory() {
  return request({
    url: '/api/job/getResultHistory',
    method: 'get'
  })
}

/**
 * @description: 获取历史SQL
 * @return {Promise}
 */
export function getSQLHistory() {
  return request({
    url: '/api/job/getSQLHistory',
    method: 'get'
  })
}

/**
 * @description: 添加历史结果
 * @param {object} data
 */
export function addResultHistory(data) {
  return request({
    url: '/api/job/addResultHistory',
    method: 'post',
    data
  })
}

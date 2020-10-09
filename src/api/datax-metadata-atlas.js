/**
 * @Date: 2020-09-24 15:51:58
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-30 16:23:35
 * @FilePath: \datax-web-ui\src\api\datax-metadata-atlas.js
 * @Description: Atlas接口
 */
// import request from '@/utils/request'
import axios from 'axios'
import qs from 'qs'

/**
 * @description: 模拟登陆发送post
 * @param {object} account
 * @return {object} axios返回信息
 */
export async function simulatePostAccount(account) {
  const res = await axios({
    url: '/j_spring_security_check',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cache-control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest'
    },
    data: qs.stringify(account),
    withCredentials: true
  }).then(simulateRedirect)
    .catch(err => console.log(err));
  return res;
}

/**
 * @description: 模拟登录向session接口get
 * @return {object} axios返回信息
 */
async function simulateRedirect() {
  const res = await axios({
    url: '/session',
    method: 'get'
  }).catch(err => console.log(err));
  return res;
}

/**
 * @description: 获取列表
 * @param {string} type 类型 entity、classification、business_metadata、enum
 * @return {object} axios返回值
 */
export async function getList(type) {
  const res = await axios({
    url: '/atlasApi/v2/types/typedefs',
    method: 'get',
    params: {
      type: type,
      _: new Date().getTime()
    }
  })
  return res
}

export async function getListType() {
  const res = await axios({
    url: '/atlasApi/v2/types/typedefs/headers',
    method: 'get',
    params: {
      excludeInternalTypesAndReferences: true,
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 获取列表各项非空项数值
 * @param {type}
 * @return {object} axios返回值
 */
export async function getItemsNotEmpty() {
  const res = await axios({
    url: '/atlasApi/admin/metrics',
    method: 'get',
    params: {
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: mysql数据类型的列表
 * @param {object} data 请求数据
 * @return {object} axios返回值
 */
export async function getTableByItems(data) {
  const res = await axios({
    url: '/atlasApi/v2/search/basic',
    method: 'post',
    data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': ''
    },
    withCredentials: true
  })
  return res
}

/**
 * @description: 获取词汇表
 * @return {object} axios返回值
 */
export async function getGlossaries() {
  const res = await axios({
    url: '/atlasApi/v2/glossary',
    method: 'get',
    params: {
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 获取自定义过滤器
 * @return {object} axios返回值
 */
export async function getCustomFilters() {
  const res = await axios({
    url: '/atlasApi/v2/search/saved',
    method: 'get',
    params: {
      _: new Date().getTime()
    }
  })
  return res
}

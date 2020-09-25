/**
 * @Date: 2020-09-24 15:51:58
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-24 16:12:33
 * @FilePath: \datax-web-ui\src\api\datax-metadata-atlas-query.js
 * @Description: 数据库信息api
 */
import request from '@/utils/request'

const baseURL = '/api/metadata'

/**
 * @description: 获取表名
 * @param {params} params get参数
 * @return {object} axios返回值
 */
export function getTables(params) {
  return request({
    url: baseURL.concat('/getTables'),
    method: 'get',
    params
  })
}

/**
 * @description: 获取schema
 * @param {params} params get参数
 * @return {object} axios返回值
 */
export function getTableSchema(params) {
  return request({
    url: baseURL.concat('/getDBSchema'),
    method: 'get',
    params
  })
}

/**
 * @description: 获取字段
 * @param {params} params get参数
 * @return {object} axios返回值
 */
export function getColumns(params) {
  return request({
    url: baseURL.concat('/getColumns'),
    method: 'get',
    params
  })
}

/**
 * @description: 根据sql获取字段
 * @param {params} params get参数
 * @return {object} axios返回值
 */
export function getColumnsByQuerySql(params) {
  return request({
    url: baseURL.concat('/getColumnsByQuerySql'),
    method: 'get',
    params
  })
}

/**
 * @description: 根据datasourceID、tablename创建表【目标端】
 * @param {params} params post参数
 * @return {object} axios返回值
 */
export function createTable(params) {
  return request({
    url: baseURL.concat('/createTable'),
    method: 'post',
    params
  })
}

/**
 * @description: 判断字段是否存在，存在，即更新值，否则添加字段
 * @param {params} params get参数
 * @return {object} axios返回值
 */
export function updateColumnsValue(query) {
  return request({
    url: baseURL.concat('/updateColumnsValue'),
    method: 'post',
    data: query
  })
}

/**
 * @description: 获取全部规则名称
 * @return {object} axios返回值
 */
export function getAllName() {
  return request({
    url: '/api/universal/univerToPerson',
    method: 'get'
  })
}

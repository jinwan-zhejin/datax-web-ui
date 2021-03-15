/**
 * @Date: 2021-03-08 15:58:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-03-15 15:47:16
 * @FilePath: \datax-web-ui\src\graphQL\graphQL-history.js
 * @Description: graphQL-history
 */

import request from '@/utils/request'

/**
 * @description: 获取历史SQL - 临时查询
 * @param {object} param
 *  parameter: {
 *    size: 10,
 *    current: 1,
 *    projectId: 0,
 *    datasourceId: 101,
 *    schema: '数据库名称',
 *    isSave: 0 //isSaved=0表示查询历史查询，isSaved=1表示保存了的历史查询
 *  }
 * @return {Promise}
 */
export function getSqlListTemp(params) {
  return request({
    url: '/api/sqlhis/page',
    method: 'get',
    params: Object.assign({ isSave: 0 }, params)
  })
}

/**
 * @description: 获取历史SQL - 已保存
 * @param {object} param
 *  parameter: {
 *    size: 10,
 *    current: 1,
 *    projectId: 0,
 *    datasourceId: 101,
 *    schema: '数据库名称',
 *    isSave: 1 //isSaved=0表示查询历史查询，isSaved=1表示保存了的历史查询
 *  }
 * @return {Promise}
 */
export function getSqlListSaved(params) {
  return request({
    url: '/api/sqlhis/page',
    method: 'get',
    params: Object.assign({ isSave: 1 }, params)
  })
}

/**
 * @description: 删除保存了的查询
 * @param {*} id
 * @return {Promise}
 */
export function deleteSaved(id) {
  return request({
    url: `/api/sqlhis/delete?id=${id}`,
    method: 'post'
  })
}

/**
 * @description: 添加历史结果 - 手动保存
 * @param {object} data
 *  parameter: {
      datasourceId: 1, //数据源id
      projectId: 1, //项目id
      databaseSchema: "test", //数据库schema
      sqlResult: "", //sql执行结果
      sqlStatus: 1, //1：成功  0：失败
      sqlContent: "select * from test", //sql语句
      submitUser: 1,  //提交用户id parseInt(localStorage.getItem('userId'))
    }
 */
export function autoSaveSql(data) {
  return request({
    url: '/api/sqlhis/tmpsave',
    method: 'post',
    data
  })
}

/**
 * @description: 添加历史结果 - 手动保存
 * @param {object} data
 *  parameter: {
      datasourceId: 1, //数据源id
      projectId: 1, //项目id
      databaseSchema: "test", //数据库schema
      sqlResult: "", //sql执行结果
      sqlStatus: 1, //1：成功  0：失败
      sqlContent: "select * from test", //sql语句
      submitUser: 1,  //提交用户id
    }
 */
export function saveSql(data) {
  return request({
    url: '/api/sqlhis/save',
    method: 'post',
    data
  })
}

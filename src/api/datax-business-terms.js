/**
 * @file 业务术语
 * @createDate 2020-09-17 11:07:00
 */

import request from '@/utils/request'

/**
 * @description 根据id获取code信息
 * @param {JSON} data
 * @return {Function} request
 */
export function changeCode(data) {
  return request({
    url: '/api/change_code',
    method: 'get',
    data
  })
}

/**
 * @description 获取业务术语
 * @param {JSON} data
 * @return {Function} request
 */
export function getCodeSet(data) {
  return request({
    url: '/api/getCodeSet',
    method: 'get',
    data
  })
}

/**
 * @description 获取列表
 * @param {JSON} data
 * @return {Function} request
 */
export function getCodesFromSet(params) {
  return request({
    url: '/api/getCodesFromSet',
    method: 'get',
    params
  })
}

/**
 * @description 根据id获取code信息
 * @param {JSON} data
 * @return {Function} request
 */
export function getCodeSetById(params) {
  return request({
    url: '/api/getCodeSetById',
    method: 'get',
    params
  })
}

/**
 * @description 送审code
 * @param {JSON} data
 * @return {Function} request
 */
export function codeSetsendAudit(params) {
  return request({
    url: '/api/sendAudit',
    method: 'get',
    params
  })
}

/**
 * @description 删除list
 * @param {JSON} data
 * @return {Function} request
 */
export function deleteCodes(params) {
  return request({
    url: '/api/deleteCodes',
    method: 'get',
    params
  })
}

/**
 * @description 删除代码集
 * @param {JSON} data
 * @return {Function} request
 */
export function deleteCodeSets(params) {
  return request({
    url: '/api/deleteCodeSets',
    method: 'get',
    params
  })
}

/**
 * @description 添加修改代码集
 * @param {JSON} data
 * @return {Function} request
 */
export function updateAndAddCodeSet(data) {
  return request({
    url: '/api/updateAndAddCodeSet',
    method: 'post',
    data
  })
}

/**
 * @description 保存
 * @param {JSON} data
 * @return {Function} request
 */
export function codeSetAddCode(data) {
  return request({
    url: '/api/addCode',
    method: 'post',
    data
  })
}

/**
 * @description
 * @param {JSON} data
 * @return {Function} request
 */
export function CodeSetUpDate(data) {
  return request({
    url: '/api/updateCode',
    method: 'post',
    data
  })
}

/**
 * @description 根据id获取code信息
 * @param {JSON} data
 * @return {Function} request
 */
export function getCodeById(data) {
  return request({
    url: '/api/getCodeById',
    method: 'post',
    data
  })
}

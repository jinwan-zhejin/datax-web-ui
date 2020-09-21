/**
 * @file 文档管理
 * @createDate 2020-09-21 09:59:00
 */

import request from '@/utils/request'

/**
 * @description 获取文档目录菜单
 * @param {JSON} params
 * @return {Function} request
 */
export function getMenuDocumentContent(params) {
  return request({
    url: '/api/getMenuDocumentContent',
    method: 'get',
    params
  })
}

/**
 * @description 获取列表
 * @param {JSON} data
 * @return {Function} request
 */
export function getDocumentFile(data) {
  return request({
    url: '/api/getDocumentFile',
    method: 'post',
    data
  })
}

/**
 * @description 删除文件
 * @param {JSON} data
 * @return {Function} request
 */
export function deleteDocumentFile(data) {
  return request({
    url: '/api/deleteFile',
    method: 'post',
    data
  })
}

/**
 * @description 删除目录
 * @param {JSON} data
 * @return {Function} request
 */
export function deleteDocumentFolder(data) {
  return request({
    url: '/api/deleteFolder',
    method: 'post',
    data
  })
}

/**
 * @description 上传文件
 * @return {string} string
 */
export function uploadFile() {
  return '/api/upload'
}

/**
 * @description 上传文件
 * @return {string} string
 */
export function updateFile() {
  return '/api/updateFile'
}

/**
 * @description 下载文件
 * @return {string} string
 */
export function downLoadFile() {
  return '/api/downLoadFile'
}

/**
 * @description 保存新建文件目录
 * @param {JSON} data
 * @return {Function} request
 */
export function addDocumentContent(data) {
  return request({
    url: '/api/addDocumentContent',
    method: 'post',
    data
  })
}

/**
 * @description 代码保存
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
 * @description 代码更新保存
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


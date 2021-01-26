import request from '@/utils/request'

// datax用户api

export function getList(params) {
  return request({
    url: '/api/user/pageList',
    method: 'get',
    params
  })
}

export function getList1(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

export function updateUser(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/api/user/remove?id=' + id,
    method: 'post'
  })
}

export function getPermission() {
  return request({
    url: '/api/user/permission',
    method: 'get'
  })
}

/**
 * @description: 查询所有用户
 * @return {*}
 */
export function getAllUser() {
  return request({
    url: '/api/user/all',
    method: 'get'
  })
}

/**
 * @description: 查询项目下所有用户
 * @param {object} params
 *  parameter: {
 *    projectId: 1,
 *    current: 1,
 *    size: 10,
 *    username: ''
 *  }
 * @return {*}
 */
export function getAllUserProject(params) {
  return request({
    url: '/api/user/project/userList',
    method: 'get',
    params
  })
}

// 重置密码
export function resetPsw(params) {
  return request({
    url: '/api/user/resetPwd',
    method: 'post',
    params
  })
}

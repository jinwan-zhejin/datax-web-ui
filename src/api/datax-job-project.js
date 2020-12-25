import request from '@/utils/request'

// project

export function list(params) {
  return request({
    url: '/api/jobProject',
    method: 'get',
    params
  })
}

export function updated(data) {
  return request({
    url: '/api/jobProject',
    method: 'put',
    data
  })
}

export function created(data) {
  return request({
    url: '/api/jobProject',
    method: 'post',
    data
  })
}

export function deleted(data) {
  return request({
    url: '/api/jobProject',
    method: 'delete',
    params: data
  })
}

export function getJobProjectList(params) {
  return request({
    url: '/api/jobProject/list',
    method: 'get',
    params
  })
}

/**
 * @description: 添加用户
 * @param {object} data
 *  parameter: {
 *    id: 0,
 *    name: 'name',
 *    description: 'description',
 *    userId: 0,
 *    flag: true,
 *    createTime: '2020-02-22',
 *    updateTime: '2020-02-22',
 *    userName: '',
 *    userIds: [1,2,3]
 *  }
 * @return {*}
 */
export function addUser(data) {
  return request({
    url: '/api/jobProject/addUser',
    method: 'post',
    data
  })
}

/**
 * @description: 根据id查询一个项目，编辑时用
 * @param {Number} id
 * @return {*}
 */
export function getInfoById(id) {
  return request({
    url: `/api/jobProject/${id}`,
    method: 'get'
  })
}

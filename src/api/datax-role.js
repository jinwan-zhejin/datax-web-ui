import request from '@/utils/request'

// datax角色api
export function getList(params) {
  return request({
    url: 'api/jobRole/list',
    method: 'get',
    params
  })
}

export function delRole(query) {
  return request({
    url: `/api/jobRole/delete?roleIds=${query}`,
    method: 'post'
  })
}

export function updataRole(data) {
  return request({
    url: '/api/jobRole/update',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/api/jobRole/save',
    method: 'post',
    data
  })
}

// 权限列表
export function menuList() {
  return request({
    url: '/api/jobMenu/select',
    method: 'get'
  })
}

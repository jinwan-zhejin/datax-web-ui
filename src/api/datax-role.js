import request from '@/utils/request'

// datax角色api
export function getList(query) {
  return request({
    url: `api/jobRole/all?name=${query}`,
    method: 'get'
  })
}

export function delRole(query) {
  return request({
    url: `/api/jobRole/delete?id=${query}`,
    method: 'post'
  })
}

export function updataRole(data) {
  return request({
    url: '/api/jobRole/delete',
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

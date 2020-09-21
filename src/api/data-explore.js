import request from '@/utils/request'

// 新增数据探查
export function addList(params) {
  return request({
    url: '/api/search/create',
    method: 'post',
    params
  })
}

// 查询所有数据探查
export function getAllList() {
  return request({
    url: '/api/search/list',
    method: 'get'
  })
}

// 查询指定数据探查
export function searchData(query) {
  return request({
    url: `/api/search/getSearchById?id=${query}`,
    method: 'get'
  })
}

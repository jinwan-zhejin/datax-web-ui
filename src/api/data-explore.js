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
export function getAllList(params) {
  return request({
    url: '/api/search/list',
    method: 'post',
    params
  })
}

// 查询指定数据探查
export function searchData(query) {
  return request({
    url: `/api/search/getSearchById?id=${query}`,
    method: 'get'
  })
}

// 删除
export function deleteData(query) {
  return request({
    url: `/api/search/remove?id=${query}`,
    method: 'get'
  })
}

// 获取详情页面表格数据
export function getTableData(params) {
  return request({
    url: '/api/metadata/listAll',
    method: 'post',
    params
  })
}

// 获取详情页面表格第二行数据
export function getTwoData(params) {
  return request({
    url: '/api/metadata/getColumnSchema',
    method: 'post',
    params
  })
}

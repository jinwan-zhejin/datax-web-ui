import request from '@/utils/request'

// 获取列表
export function getList() {
  return request({
    url: '/api/universal/pageUniversal',
    method: 'get'
  })
}

// 添加列表
export function addList(data) {
  return request({
    url: '/api/universal/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 删除列表
export function delList(query) {
  return request({
    url: `/api/universal/delete/${query}`,
    method: 'post'
  })
}

// 关联个性化规则
export function relateRule(params) {
  return request({
    url: '/api/universal/update',
    method: 'post',
    params
  })
}

// 通用规则详情
export function detailsRule(query) {
  return request({
    url: `/api/universal/delete/?id=${query}`,
    method: 'post'
  })
}

// 根据规则大类查询规则小类
export function cascade(query) {
  return request({
    url: `/api/universal/delete/?id=${query}`,
    method: 'post'
  })
}

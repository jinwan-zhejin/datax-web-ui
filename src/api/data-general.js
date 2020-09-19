import request from '@/utils/request'

// 获取列表
export function getList(val1, val2, val3) {
  return request({
    url: `/api/universal/pageUniversal?current=${val1}&size=${val2}&name=${val3}`,
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

// 编辑
export function editList(data) {
  return request({
    url: '/api/universal/update',
    method: 'post',
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

// 根据规则大类查询规则小类
export function cascade(query) {
  return request({
    url: `/api/universal/universalName/${query}`,
    method: 'get'
  })
}

// 检测编码是否重复
export function check(query) {
  return request({
    url: `/api/universal/check?code=${query}`,
    method: 'get'
  })
}

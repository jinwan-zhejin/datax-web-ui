import request from '@/utils/request'

// 获取列表
export function getList(val1, val2, val3, val4) {
  return request({
    url: `/api/personalise/pagePersonalise?current=${val1}&size=${val2}&type=2&name=${val3}&joinType=${val4}`,
    method: 'get'
  })
}

// 个性化规则添加
export function addPerson(data) {
  return request({
    url: '/api/personalise/add',
    method: 'post',
    data
  })
}

// 编辑个性化规则
export function editPerson(data) {
  return request({
    url: '/api/personalise/update',
    method: 'post',
    data
  })
}

// 删除个性化规则
export function delPerson(query) {
  return request({
    url: `/api/personalise/delete/${query}`,
    method: 'post'
  })
}

// 检测编码是否重复
export function check(query) {
  return request({
    url: `/api/personalise/check?code=${query}`,
    method: 'get'
  })
}

import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/routes',
    method: 'get',
    params
  })
}

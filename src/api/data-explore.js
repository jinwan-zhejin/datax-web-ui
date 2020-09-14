import request from '@/utils/request'

export function addList(params) {
  return request({
    url: '/api/search/create',
    method: 'post',
    headers: {
      'enctype': 'multipart/form-data'
    },
    params
  })
}

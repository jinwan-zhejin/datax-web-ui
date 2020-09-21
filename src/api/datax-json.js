import request from '@/utils/request'

// buildJobJson
export function buildJobJson(data) {
  return request({
    url: '/api/dataxJson/buildJson',
    method: 'post',
    data
  })
}

// 构建
export function buildJson(data) {
  return request({
    url: '/api/qualityJson/buildJson',
    method: 'post',
    data
  })
}

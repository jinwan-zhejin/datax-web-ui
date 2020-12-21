import request from '@/utils/request'

// dashborad

export function chartInfo(data) {
  return request({
    url: '/api/chartInfo',
    method: 'post',
    data
  })
}

export function getKPI() {
  return request({
    url: '/api/getRunReport',
    method: 'get'
  })
}

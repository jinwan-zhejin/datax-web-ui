import request from '@/utils/request'

// 其他地址登录
export function goLogin() {
  return request({
    url: '/login',
    method: 'get'
  })
}


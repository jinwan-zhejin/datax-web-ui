import request from '@/utils/request'

// 其他地址登录 res.code: undefined
export async function goLoginGet() {
  return request({
    url: '/login/',
    method: 'get'
  })
}

export async function goLoginPost(data) {
  return request({
    url: '/login/',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

/**
 * @description 获取csrf_token登录跳转到welcome页面
 * @param {json} data
 */
export async function goWelcome(data, csrf_token) {
  return request({
    url: '/welcome',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data,
    withCredentials: true
  })
}

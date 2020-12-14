import request from '@/utils/request'

// 其他地址登录 res.code: undefined
export async function goLoginGet() {
  return request({
    url: '/login/',
    method: 'get',
    withCredentials: true
  })
}

export async function goLoginPost(data) {
  return request({
    url: '/login/',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data,
    withCredentials: true
  })
}

/**
 * @description 获取csrf_token登录跳转到welcome页面
 * @param {json} data
 */
export async function goWelcome(data) {
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

export async function goWhere(data) {
  return request({
    url: '/',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data,
    withCredentials: true
  })
}

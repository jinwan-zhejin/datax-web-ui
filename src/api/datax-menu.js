import request from '@/utils/request'

// 菜单权限列表
export function menuList() {
  return request({
    url: '/api/jobMenu/list',
    method: 'get'
  })
}

// 添加菜单
export function addMenu(data) {
  return request({
    url: '/api/jobMenu/save',
    method: 'post',
    data
  })
}

// 编辑菜单
export function editMenu(data) {
  return request({
    url: '/api/jobMenu/update',
    method: 'post',
    data
  })
}

// 删除菜单
export function delMenu(query) {
  return request({
    url: `/api/jobMenu/delete/${query}`,
    method: 'post'
  })
}

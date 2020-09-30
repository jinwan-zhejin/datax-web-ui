import request from '@/utils/request'

// 数据库信息api

// 获取表名
export function getTables(params) {
  return request({
    url: '/api/metadata/getTables',
    method: 'get',
    params
  })
}

// 获取schema
export function getTableSchema(params) {
  return request({
    url: '/api/metadata/getDBSchema',
    method: 'get',
    params
  })
}

// 获取字段
export function getColumns(params) {
  return request({
    url: '/api/metadata/getColumns',
    method: 'get',
    params
  })
}

// 获取字段, 类型，comment
export function getTableColumns(params) {
  return request({
    url: '/api/metadata/getTableColumns',
    method: 'get',
    params
  })
}

// 根据sql获取字段
export function getColumnsByQuerySql(params) {
  return request({
    url: '/api/metadata/getColumnsByQuerySql',
    method: 'get',
    params
  })
}

// 根据datasourceID、tablename创建表【目标端】
export function createTable(params) {
  return request({
    url: '/api/metadata/createTable',
    method: 'post',
    params
  })
}
// 判断字段是否存在，存在，即更新值，否则添加字段
export function updateColumnsValue(query) {
  return request({
    url: '/api/metadata/updateColumnsValue',
    method: 'post',
    data: query
  })
}

// 获取全部规则名称
export function getAllName() {
  return request({
    url: '/api/universal/univerToPerson',
    method: 'get'
  })
}

// 获取某个schema下的所有元数据
export function getDbMetadata(params) {
  console.log(params)
  return request({
    url: '/api/metadata/import',
    method: 'post',
    params
  })
}

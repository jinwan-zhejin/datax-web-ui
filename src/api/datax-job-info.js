import request from '@/utils/request'

// datax插件api

export function getList(params) {
  return request({
    url: 'api/job/pageList',
    method: 'get',
    params
  })
}

export function triggerJob(data) {
  return request({
    url: '/api/job/trigger',
    method: 'post',
    data
  })
}

export function startJob(id) {
  return request({
    url: '/api/job/start?id=' + id,
    method: 'post'
  })
}

export function stopJob(id) {
  return request({
    url: '/api/job/stop?id=' + id,
    method: 'post'
  })
}

export function getExecutorList() {
  return request({
    url: 'api/jobGroup/list',
    method: 'get'
  })
}

export function updateJob(data) {
  return request({
    url: '/api/job/update',
    method: 'post',
    data
  })
}

export function createJob(data) {
  return request({
    url: '/api/job/add/',
    method: 'post',
    data
  })
}

export function removeJob(id) {
  return request({
    url: '/api/job/remove/' + id,
    method: 'post'
  })
}

export function nextTriggerTime(cron) {
  return request({
    url: '/api/job/nextTriggerTime?cron=' + cron,
    method: 'get'
  })
}
export function viewJobLog(id) {
  return request({
    url: '/api/log/logDetailCat?id=' + id,
    method: 'get'
  })
}

export function getUsersList(params) {
  return request({
    url: 'api/user/list',
    method: 'get',
    params
  })
}

export function getJobIdList(params) {
  return request({
    url: 'api/job/list',
    method: 'get',
    params
  })
}
// batchAdd
export function batchAddJob(data) {
  return request({
    url: '/api/job/batchAdd',
    method: 'post',
    data
  })
}

export function getDataSourceDetail(id) {
  return request({
    url: `/api/jobJdbcDatasource/${id}`,
    method: 'get'
  })
}

/**
 * @description: 获取任务执行结果
 * @param {object} params
 *  parameter: {
 *    taskId: 1,
 *    current: 1,
 *    size: 10
 *  }
 * @return {*}
 */
export function getTaskResult(params) {
  return request({
    url: '/api/job/jobResult',
    method: 'get',
    params
  })
}

/**
 * @description: 导出执行结果为excel
 * @param {object} params
 *  parameter: {
 *    taskId: 1,
 *  }
 * @return {*}
 */
export function exportTaskResult(params) {
  return request({
    url: '/api/job/excel',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 获取tree数据结构建
export function getTreeData(query) {
  return request({
    url: `/api/jobProjectGroup/tree?projectId=${query}`,
    method: 'get'
  })
}

// 新增文件或文件夹
export function createNewFile(data) {
  return request({
    url: '/api/jobProjectGroup/save',
    method: 'post',
    data
  })
}

// 删除文件或文件夹
export function delFile(query) {
  return request({
    url: `/api/jobProjectGroup/delete?id=${query}`,
    method: 'post'
  })
}

// 根据jobId查询一个任务信息
export function getTaskInfo(query) {
  return request({
    url: `/api/job/info?jobId=${query}`,
    method: 'get'
  })
}

// 重命名和拖拽接口
export function dragReName(data) {
  return request({
    url: '/api/jobProjectGroup/update',
    method: 'post',
    data
  })
}

// 粘贴接口
export function pasteObj(query, data) {
  return request({
    url: `/api/jobProjectGroup/paste?pid=${query}`,
    method: 'post',
    data
  })
}

// 查看文件版本列表
export function fileVersion(query) {
  return request({
    url: `/api/jobVersion/pageVersionList?jobId=${query}`,
    method: 'get'
  })
}

// 版本回滚接口
export function dataRollBack(data) {
  return request({
    url: '/api/jobVersion/rollBackVersion',
    method: 'post',
    data
  })
}

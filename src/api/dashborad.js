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

/**
 * @description: 项目 - 文字统计
 */
export function getObjectStatistics() {
  return request({
    url: '/api/getProjectCountReport',
    method: 'post'
  })
}

/**
 * @description: 项目 - 分布统计
 */
export function getObjectDistribute() {
  return request({
    url: '/api/getItemTaskDistribution',
    method: 'post'
  })
}

/**
 * @description: 项目 - 类型分布统计
 */
export function getObjectType() {
  return request({
    url: '/api/getItemTaskTypeDistribution',
    method: 'post'
  })
}

/**
 * @description: 项目 - 运行分布统计
 */
export function getObjectRun() {
  return request({
    url: '/api/getItemTaskRunStateDistribution',
    method: 'post'
  })
}

/**
 * @description: 数据源 - 文字统计
 */
export function getSourceStatistics() {
  return request({
    url: '/api/getDataSourceReport',
    method: 'post'
  })
}

/**
 * @description: 任务 - 文字统计
 */
export function getTaskStatistics() {
  return request({
    url: '/api/getTriggerCountReport',
    method: 'post'
  })
}

/**
 * @description: 任务 - 分布统计
 */
export function getTaskDistribute() {
  return request({
    url: '/api/getTaskTypeDistribution',
    method: 'post'
  })
}

/**
 * @description: 任务 - 分布统计（按照执行器）
 */
export function getTaskDistributeE() {
  return request({
    url: '/api/getTaskExecutorDistribution',
    method: 'post'
  })
}

/**
 * @description: 任务 - 结果统计
 */
export function getTaskResult() {
  return request({
    url: '/api/getTaskResultReport',
    method: 'post'
  })
}

/**
 * @description: 规则 - 文字统计
 */
export function getRuleStatistics() {
  return request({
    url: '/api/getRuleReport',
    method: 'post'
  })
}

/**
 * @description: 规则 - 图表统计
 */
export function getRuleChart() {
  return request({
    url: '/api/getUsedRule',
    method: 'post'
  })
}

/**
 * @description: 接口 - 文字统计
 */
export function getApiStatistics() {
  return request({
    url: '/api/getInterface',
    method: 'post'
  })
}

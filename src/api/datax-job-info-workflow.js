/**
 * @Date: 2020-11-06 10:05:53
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-11-11 11:29:27
 * @FilePath: \datax-web-ui\src\api\datax-job-info-workflow.js
 * @Description: 任务管理 - 虚任务 接口
 */

import request from '@/utils/request'

/**
 * @description: 保存虚任务
 * @param {object} data
 *  {
      "id": 任务Id【分类Id】,
      "jobDesc": "(R)任务描述",
      "jobCron": "(R)Cron表达式",
      "jobJson": "(R)流程图信息"【包含infoId当前虚任务id】
      "triggerNextTime": (N)<Bigint>下次调度时间,
    }
 * @return {Promise}
 *  {
      "code": 200,
      "msg": "保存成功",
      "content": null
    }
 */
export function addVirtualTask(data) {
  return request({
    url: '/api/job/addVirtualTask',
    method: 'post',
    data
  })
}

/**
 * @description: 触发虚任务
 * @param {object} data
 *  {
      "id": 任务Id
    }
 * @return {Promise}
 *  {
      "code": 200,
      "msg": null,
      "content": null
    }
 */
export function triggerVirtualTask(data) {
  return request({
    url: '/api/job/triggerVirtualTask',
    method: 'post',
    data
  })
}

/**
 * @description: 查询虚任务
 * @param {object} param
 *  {
      "jobInfoId": "(N)任务Id",
      "projectId": (R)项目Id
    }
 * @return {Promise}
 *  {
      "code": 200,
      "msg": null,
      "content": [
        {
          "jobInfoId": "ff4e35232e5b4ec4b3cbdb47e8f11a47",
          "jobInfoName": "测试虚任务2",
          "jobCron": "00 10 10 ? * * *",
          "flowChatInformation": "222222",
          "triggerNextTime": 1604628600000,
          "projectId": 2
        }
      ]
    }
 */
export function listVirtualTask(params) {
  return request({
    url: '/api/job/listVirtualTask',
    method: 'get',
    params
  })
}

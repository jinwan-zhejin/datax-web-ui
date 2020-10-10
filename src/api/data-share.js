import request from '@/utils/request'

// 获取接口列表
export function getList(data) {
  return request({
    url: '/api/applyResource/getInterfaceResult',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 获取接口使用列表
export function getUseList(data) {
  return request({
    url: '/api/applyResource/getMyApplyResourcePages',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 接口使用列表-查询详情
export function viewDetail(query) {
  return request({
    url: `/api/applyResource/getInterfaceByinfoId?id=${query}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 接口使用列表-查询详情-审批详情
export function ExamineDetail(query) {
  return request({
    url: `/api/resExamine/getResourceExamineByResId${query}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取接口注册列表
export function registerList(data) {
  return request({
    url: '/api/interface/getInterfaceInfoPages',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 接口注册列表-查看详情
export function regViewDetail(query) {
  return request({
    url: `/api/interface/getInterfaceDetails${query}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 接口注册列表-查看详情-审批详情
export function regExamineDetail(query) {
  return request({
    url: `/api/interface/getInterfaceDetails?id=${query}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 查询所有服务器名称
export function getServerName() {
  return request({
    url: '/api/interface/getInterfaceDetails',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 查询信息资源列表
export function getInfoList(query) {
  return request({
    url: `/api/dataCatalog/getCatalogByServerName?serverName=${query}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 获取信息资源数据项列表
export function getItemByInfoList(query) {
  return request({
    url: `/api/dataCatalog/getItemByInfoName?serverName=${query}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 注册接口信息
export function regInterFace(data) {
  return request({
    url: '/api/interface/insertInterface',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 注册审批列表查询
export function auditSearch(data) {
  return request({
    url: '/api/interface/getInterfaceExamPage',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 注册接口审批
export function interFaceAudit(data) {
  return request({
    url: '/api/interface/approvalInterface',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 接口列表-查询详情-申请接口
export function AnduploadFile(data) {
  return request({
    url: '/api/applyResource/applyAnduploadFile',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 申请审批
export function applyApproval(data) {
  return request({
    url: '/api/resExamine/approveResource',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 申请审批列表查询
export function getResourceExamPages(data) {
  return request({
    url: '/api/resExamine/getResourceExamPages',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

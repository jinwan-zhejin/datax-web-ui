/**
 * @Date: 2020-09-24 15:51:58
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-30 16:33:15
 * @FilePath: \datax-web-ui\src\api\datax-metadata-atlas.js
 * @Description: Atlas接口
 */
// import request from '@/utils/request'
import axios from 'axios'
import qs from 'qs'
import request from '@/utils/request'

/**
 * @description: 模拟登陆发送post
 * @param {object} account
 * @return {object} axios返回信息
 */
export async function simulatePostAccount(account) {
  const res = await axios({
    url: '/j_spring_security_check',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cache-control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest'
    },
    data: qs.stringify(account),
    withCredentials: true
  }).then(simulateRedirect)
    .catch(err => console.log(err));
  return res;
}

/**
 * @description: 模拟登录向session接口get
 * @return {object} axios返回信息
 */
async function simulateRedirect() {
  const res = await axios({
    url: '/session',
    method: 'get'
  }).catch(err => console.log(err));
  return res;
}

/**
 * @description: 获取列表
 * @param {string} type 类型 entity、classification、business_metadata、enum
 * @return {object} axios返回值
 */
export async function getList(type) {
  const res = await axios({
    url: '/atlasApi/v2/types/typedefs',
    method: 'get',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    params: {
      type: type,
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 添加分类
 * @param {object} 添加分类参数
 * @return {object} axios返回值
 */
export async function addNewClassification(data) {
  var tempClass = []
  tempClass.push(data)
  const res = await axios({
    url: '/atlasApi/v2/types/typedefs?type=classification',
    method: 'post',
    data: {
      entityDefs: [],
      enumDefs: [],
      structDefs: [],
      classificationDefs: tempClass
    },
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': '""'
    }
  })
  return res
}

/**
 * @description: 删除新分类
 * @param {object} 添加分类参数
 * @return {object} axios返回值
 */
export async function deleteNewClassification(name) {
  const res = await axios({
    url: '/atlasApi/v2/types/typedef/name/'.concat(name),
    method: 'delete',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': '""'
    }
  })
  return res
}

/**
 * @description: 修改分类
 * @param {object} 修改分类参数
 * @return {object} axios返回值
 */
export async function editNewClassification(data) {
  var tempClass = []
  tempClass.push(data)
  const res = await axios({
    url: '/atlasApi/v2/types/typedefs',
    method: 'put',
    params: {
      type: 'classification'
    },
    data: {
      entityDefs: [],
      enumDefs: [],
      structDefs: [],
      classificationDefs: tempClass
    },
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': '""'
    }
  })
  return res
}

/**
 * @description: 获取所有实体
 * @return {object} axios返回值
 */
export async function getListType() {
  const res = await axios({
    url: '/atlasApi/v2/types/typedefs/headers',
    method: 'get',
    params: {
      excludeInternalTypesAndReferences: true,
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 获取列表各项非空项数值
 * @param {type}
 * @return {object} axios返回值
 */
export async function getItemsNotEmpty() {
  const res = await axios({
    url: '/atlasApi/admin/metrics',
    method: 'get',
    params: {
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: mysql数据类型的列表
 * @param {object} data 请求数据
 *                attributes: ["额外显示的列"]，
                  classification: "分类"，
                  entityFilters: "实体过滤器"，
                  excludeDeletedEntities: true，
                  includeClassificationAttributes: true，
                  includeSubClassifications: true，
                  includeSubTypes: true，
                  limit: 25页面显示条数，
                  offset: 0偏移，
                  query: null，
                  tagFilters: "分类过滤器"，
                  termName: "术语名"，
                  typeName: "实体名"
 * @return {object} axios返回值
 */
export async function getTableByItems(data) {
  const res = await axios({
    url: '/atlasApi/v2/search/basic',
    method: 'post',
    data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': ''
    },
    withCredentials: true
  })
  return res
}

/**
 * @description: 获取词汇表
 * @return {object} axios返回值
 */
export async function getGlossaries() {
  const res = await axios({
    url: '/atlasApi/v2/glossary',
    method: 'get',
    params: {
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 获取自定义过滤器
 * @return {object} axios返回值
 */
export async function getCustomFilters() {
  const res = await axios({
    url: '/atlasApi/v2/search/saved',
    method: 'get',
    params: {
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 重命名自定义过滤器
 * @param {object} data参数
 * @return {object} axios返回值
 */
export async function setCustomFilters(data) {
  const res = await axios({
    url: '/atlasApi/v2/search/saved',
    method: 'put',
    data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': '""'
    }
  })
  return res
}

/**
 * @description: 新增自定义过滤器
 * @param {object} data参数
 * @return {object} axios返回值
 */
export async function addCustomFilters(data) {
  const res = await axios({
    url: '/atlasApi/v2/search/saved',
    method: 'post',
    data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': '""'
    }
  })
  return res
}

/**
 * @description: 新增自定义过滤器
 * @param {object} data参数
 * @return {object} axios返回值
 */
export async function deleteCustomFilters(guid) {
  const res = await axios({
    url: '/atlasApi/v2/search/saved/'.concat(guid),
    method: 'delete',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': '""'
    }
  })
  return res
}

/**
 * @description: 获取details页面审核Audits信息
 * @param {String} guid
 * @return {object} axios返回值
 */
export async function getDetailsAudits(guid) {
  const res = await axios({
    url: '/atlasApi/v2/entity/'.concat(guid).concat('/audit'),
    method: 'get',
    params: {
      count: 26,
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 获取details页面属性Properties信息
 * @param {String} guid
 * @return {object} axios返回值
 */
export async function getDetailsProperties(guid) {
  const res = await axios({
    url: '/atlasApi/v2/entity/guid/'.concat(guid),
    method: 'get',
    params: {
      minExtInfo: true,
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 获取details页面系谱Lineage信息
 * @param {String} guid
 * @return {object} axios返回值
 */
export async function getDetailsLineage(guid) {
  const res = await axios({
    url: '/atlasApi/v2/lineage/'.concat(guid),
    method: 'get',
    params: {
      '': '',
      _: new Date().getTime()
    }
  })
  return res
}

/**
 * @description: 获取快速查找框内快速查找结果
 * @param {String} searchText 查找词
 * @return {object} axios返回值
 */
export async function getQuickSearch(searchText) {
  const res = await axios({
    url: '/atlasApi/v2/search/quick',
    method: 'get',
    params: {
      query: searchText.concat('*'),
      limit: 5,
      offset: 0
    }
  })
  return res
}

/**
 * @description: 获取快速查找框内建议结果
 * @param {String} searchText 查找词
 * @return {object} axios返回值
 */
export async function getQuickSuggest(searchText) {
  const res = await axios({
    url: '/atlasApi/v2/search/suggestions',
    method: 'get',
    params: {
      prefixString: searchText
    }
  })
  return res
}

/**
 * @description: 添加分类
 * @param {object} 参数
 * @return {object} axios返回值
 */
export async function addClassification(data) {
  const res = await axios({
    url: '/atlasApi/v2/entity/bulk/classification',
    method: 'post',
    data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': '""'
    }
  }).catch(res => console.log(res))
  return res
}

export async function deleteClassification(guid, classification) {
  const res = await axios({
    url: '/atlasApi/v2/entity/guid/'.concat(guid).concat('/classification/').concat(classification),
    method: 'delete',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-HEADER': '""'
    }
  })
  return res
}

/**
 * @description: 根据guid获取该entity的所有版本信息集合，包括时间戳等
 * @param {String} 参数guid
 * @return {object} axios返回值
 */
export async function getVersionInfo(guid) {
  const res = await request({
    url: '/api/metadata/audit',
    method: 'get',
    params: {
      guid
    },
    withCredentials: true
  })
  return res
}

/**
 * @description: 获取两个版本数据对比结果
 * @param {String} 参数guid
 * @param {object} timestamps 时间(版本号)
 * @return {object} axios返回值
 */
export async function getCompareResult(guid, timestamps) {
  const res = await request({
    url: '/api/metadata/contrast',
    method: 'post',
    data: {
      'guid': guid,
      'timestamp': [
        timestamps.baselineTime,
        timestamps.toTime
      ]
    },
    withCredentials: true
  })
  return res
}

/**
 * @description: 获取所有版本比对记录
 * @return {object} axios返回值
 */
export async function getAllCompareRecord() {
  const res = await request({
    url: '/api/metadata/contrast/all',
    method: 'get',
    withCredentials: true
  })
  return res
}

/**
 * @description: 获取单个版本比对记录
 * @param {String} guid
 * @return {object} axios返回值
 */
export async function getOneCompareRecord(id) {
  const res = await request({
    url: '/api/metadata/contrast/record',
    method: 'get',
    params: {
      id
    },
    withCredentials: true
  })
  return res
}

/**
 * @description: 获取guid下所有比对记录
 * @param {String} guid
 * @return {object} axios返回值
 */
export async function getGuidAllCompareRecord(guid) {
  const res = await request({
    url: '/api/metadata',
    method: 'get',
    params: {
      guid
    },
    withCredentials: true
  })
  return res
}

/**
 * @description: 获取dsl返回值
 * @param {object} params 参数
 * @return {object} axios返回值
 */
export async function getDSLResult(params) {
  const res = await axios({
    url: '/atlasApi/v2/search/dsl',
    method: 'get',
    params,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).catch(err => {
    return err.response
  })
  return res
}

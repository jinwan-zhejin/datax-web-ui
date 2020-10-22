const translate = {
  'owner': '所有人',
  'ownertype': '所有人类型',
  'updatedby': '更新人',
  'updatetime': '更新时间',
  'createdby': '创建人',
  'createtime': '创建时间',
  'modifiedtime': '修改时间',
  'qualifiedname': '合格名称',
  'displayname': '显示名称',
  'version': '版本',
  'instance': '实例',
  'contact_info': '联系信息',
  'description': '描述',
  'prodorother': '产品或其他',
  'replicatedfrom': '复制来源',
  'replicatedto': '复制目的地',
  'userdescription': '用户描述',
  'hostname': '主机名',
  'port': '端口',
  'databases': '数据库',
  'database': '数据库',
  'comment': '批注',
  'rdbms_type': '数据库类型',
  'filesize': '文件大小',
  'path': '路径',
  'numberofreplicas': '副本数',
  'isfile': '是否为文件',
  'issymlink': '是否符号链接',
  'guid': '唯一标识',
  'name': '名称',
  'inputtoprocesses': '输入到流程',
  'outputfromprocesses': '输出自流程',
  'meanings': '意义',
  'table': '表',
  'tables': '表',
  'schema': '概要',
  'type': '类型',
  'term': '术语',
  'tag': '分类',
  'classification': '分类',
  'classifications': '分类',
  'model': '模型',
  'pipeline': '管道',
  'createdtimestamp': '创建时间戳',
  'lastmodifiedtimestamp': '最后修改时间戳',
  'lastmodifieduser': '最后修改人',
  'createdbyuser': '创建人',
  'status': '状态',
  'typename': '类型名称',
  'label': '标签',
  'label(s)': '标签',
  'labels': '标签',
  'user-definedproperties': '用户定义属性',
  'isincomplete': '是否不完整',
  'usage': '使用',
  'usages': '使用',
  'add': '添加',
  'added': '添加',
  'entity': '实体',
  'create': '创建',
  'update': '修改',
  'import': '导入',
  'delete': '删除',
  'purge': '清除',
  'propagated': '已传播',
  'attribute': '属性',
  'starttimestamp': '开始时间戳',
  'collectiontime': '数据查询时间戳',
  'activetimestamp': '活跃数据时间戳',
  'statusbackendstore': '后端存储状态',
  'statusindexstore': '索引存储状态',
  'uptime': '正常运行时间',
  'previousday': '前一天',
  'previoushour': '前一小时',
  'total': '全部',
  'currentday': '当天',
  'currenthour': '当前小时',
  'os.spec': '操作系统',
  'os.vcpus': 'CPU数',
  'heapcommitted': '已提交堆内存',
  'heapinit': '初始化堆内存',
  'heapmax': '堆内存最大值',
  'heapused': '堆内存已使用',
  'memory': '内存',
  'pool': '池',
  'nonheapcommitted': '非堆内存提交',
  'nonheapinit': '非堆内存初始化',
  'nonheapmax': '非堆内存最大值',
  'nonheapused': '非堆内存已使用'
}
// export default translate

/**
 * @description: 获取EN -> CN (含空格) 单词/短语
 * @param {type}
 * @return {type}
 */
export function translater(str) {
  var temp = str.replace(/\ /g, '')
  if (translate.hasOwnProperty(temp.toLowerCase())) {
    return translate[temp.toLowerCase()]
  }
  return str
}
/**
 * @description: 获取EN -> CN (含空格或_) 短句
 * @param {type}
 * @return {type}
 */
export function translaterMaster(str) {
  if (str.indexOf('_') > -1) {
    str = str.replace(/\_/g, ' ')
  }
  const list = str.split(' ')
  var result = ''
  for (var i in list) {
    if (translate.hasOwnProperty(list[i].toLowerCase())) {
      result += translate[list[i].toLowerCase()]
    } else {
      result += list[i]
    }
  }
  if (result !== '') {
    return result
  }
  return str
}


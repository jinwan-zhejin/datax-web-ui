import * as job from '@/api/datax-job-info';

const state = {
  allTabType: {
    'NORMAL': '普通任务',
    'IMPORT': '引入任务',
    'EXPORT': '导出任务',
    'COMPUTE': '计算任务',
    'SQLJOB': 'SQL任务',
    'SPARK': 'SPARK任务',
    'DQCJOB': '质量任务',
    'METACOLLECT': '元数据采集任务',
    'METACOMPARE': '元数据比较任务',
    'SHELL': 'SHELL任务',
    'POWERSHELL': 'POWERSHELL任务',
    'PYTHON': 'PYTHON任务',
    'VJOB': '虚任务',
    'JAVA': 'Java任务',
    'SCALA': 'Scala任务',
    'PYSPARK': 'PySpark任务',
    'R': 'R任务',
    'BATCH': '任务批量构建',
    'TEMPLATE': '普通任务模板'

  },

  tabTypeArr: ['NORMAL', 'IMPORT', 'EXPORT', 'COMPUTE', 'SQLJOB', 'SPARK', 'DQCJOB', 'METACOLLECT', 'METACOMPARE', 'SHELL', 'POWERSHELL', 'PYTHON', 'VJOB', 'JAVA', 'SCALA', 'PYSPARK', 'R', 'BATCH', 'TEMPLATE'],

  tabType: '',

  tableData: [], // 新建时的表格类型

  projectId: '', // 选择项目的id

  dataSourceList: [], // 数据库源

  taskList: [], // 任务列表

  taskDetailList: [], // 任务详情列表

  taskDetailID: '', // 当前选中任务详情id

  jobParam: '', // 创建任务的jobparam

  // ===========================================

  readerDataSourceID: '', //

  writerDataSourceID: '',

  readerColumns: [], // 所有reader字段

  writerColumns: [], // 所有writer	字段

  selectReaderColumn: [], // 已选中reader字段

  selectWriterColumn: [], // 已选中writer字段

  readerTableName: '', // reader表

  writerTableName: '', // writer表

  readerSchema: '', // reader Schema

  writerSchema: '', // writer Schema

  // ==========================================

  readerAllowEdit: true, // reader启用编辑

  logViewType: 0,

  jobInfoType: '',

  jobRule: [], // 规则

  jobInfo: {}, // 任务信息

  Group: {}, // 选中任务对象

  GroupId: '', // 选中任务Id

  GroupName: {}, // 选中任务对象名称

  readerIsEdit: true, // true编辑，false更新

  watchStr: 1, // 监视对象

  logWatch: false, // 可以查看实时日志

  PartitionVal: '',

  jobDataDetail: {}, // 任务数据详情

  scheduleId: '', // 调度任务修改id

  sqlParams: {
    projectId: '', // 项目ID
    datasourceId: '', // 数据源ID
    schema: '' // 数据库名
  }
}

const mutations = {
  SET_TAB_TYPE: (state, type) => {
    state.tabType = type
  },

  setScheduleId: (state, payload) => {
    state.scheduleId = payload
  },

  getJobDetail: (state, payload) => {
    state.jobDataDetail = payload
  },

  changePartitionText: (state, payload) => {
    state.PartitionVal = payload
  },

  changeGroupData(state, payload) {
    state.Group = payload
  },

  changeWatch(state, payload) {
    state.watchStr += payload
  },

  changeJobId(state, payload) {
    state.GroupId = payload
  },

  changeGroupName(state, payload) {
    state.GroupName = payload
  },

  SET_TABLEDATA: (state, arr) => {
    state.tableData = arr
  },

  SET_PROJECT_ID: (state, id) => {
    state.projectId = id
  },

  SET_DATASOURCE: (state, arr) => {
    state.dataSourceList = arr
  },

  SET_READER_DATASOURCE_ID: (state, id) => {
    state.readerDataSourceID = id
  },

  SET_WRITER_DATASOURCE_ID: (state, id) => {
    state.writerDataSourceID = id
  },

  SET_TASKLIST: (state, list) => {
    state.taskList = list
  },

  SET_TASKDETAIL_LIST: (state, list) => {
    state.taskList = list
  },

  DELETE_TASKDETAIL: (state, removeIndex) => {
    state.taskDetailList.splice(removeIndex, 1)
  },

  ADD_TASKDETAIL: (state, ele) => {
    state.taskDetailList.push(ele)
  },

  SET_TASKDETAIL_ID: (state, id) => {
    state.taskDetailID = id // 设置当前选中id
  },

  SET_JOBPARAM: (state, param) => {
    state.jobParam = param
  },

  SET_READER_COLUMNS: (state, columns) => {
    state.readerColumns = columns
  },

  SET_WRITER_COLUMNS: (state, columns) => {
    state.writerColumns = columns
  },

  SET_READER_TABLENAME: (state, tableName) => {
    state.readerTableName = tableName
  },

  SET_WRITER_TABLENAME: (state, tableName) => {
    state.writerTableName = tableName
  },

  SET_SELECT_READERCOLUMN: (state, columns) => {
    state.selectReaderColumn = columns
  },

  SET_SELECT_WRITERCOLUMN: (state, columns) => {
    state.selectWriterColumn = columns
  },

  SET_READER_EDITABLE: (state, editable) => {
    state.readerAllowEdit = editable
  },

  SET_LOGVIEW_TYPE: (state, type) => {
    state.logViewType = type
  },

  SET_JOBINFO_TYPE: (state, type) => {
    state.jobInfoType = type
  },

  SET_JOBRULE: (state, rule) => {
    state.jobRule = rule
  },

  ADD_RULEITEM: (state) => {
    state.jobRule.push({
      columnName: '',
      ruleId: [],
      status: 1
    })
  },

  EDIT_RULEITEM: (state, ruleItem, index) => {
    state.jobRule.splice(index, 1, ruleItem)
  },

  DELETE_RULEITEM: (state, ruleItem) => {
    const index = state.jobRule.indexOf(ruleItem);
    state.jobRule.splice(index, 1)
  },

  SET_READER_SCHEMA: (state, schema) => {
    state.readerSchema = schema
  },

  SET_WRITER_SCHEMA: (state, schema) => {
    state.writerSchema = schema
  },

  SET_JOB_INFO: (state, jobInfo) => {
    state.jobInfo = jobInfo
  },

  SET_READER_ISEDIT: (state, isEdit) => {
    state.readerIsEdit = isEdit
  },

  SET_LOG_WATCH: (state, logWatch) => {
    state.logWatch = logWatch
  },

  SET_SQLP_PROJECTID: (state, val) => {
    state.sqlParams.projectId = val
  },
  SET_SQLP_DATASOURCEID: (state, val) => {
    state.sqlParams.datasourceId = val
  },
  SET_SQLP_SCHEMA: (state, val) => {
    state.sqlParams.schema = val
  }
}

const actions = {

  /**
   * @method getTaskList
   * @param {*} param0
   * @param {*} isAddTask 是否是新建任务，并设置当前选中任务为添加的任务
   */
  getTaskList({ commit, state }, isAddTask) {
    const listQuery = {
      current: 1,
      size: 10000,
      jobGroup: 0,
      projectIds: state.projectId,
      triggerStatus: -1,
      jobDesc: '',
      glueType: ''
    };

    job.getList(listQuery).then(response => {
      commit('SET_TASKDETAIL_LIST', response.content.data);
      if (isAddTask) {
        const firstElement = response.content.data[0] || {};
        const a = {};
        a.title = firstElement.jobDesc;
        a.name = firstElement.jobDesc;
        a.content = firstElement;
        commit('ADD_TASKDETAIL', a);
        commit('SET_JOB_INFO', response.content.data[0])
        commit('SET_TASKDETAIL_ID', a.content.id + '');
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}

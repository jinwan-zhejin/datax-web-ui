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

  readerDataSourceID: '', //

  writerDataSourceID: '',

  taskList: [], // 任务列表

  taskDetailList: [], // 任务详情列表

  taskDetailID: '',// 当前选中任务详情id

  jobParam: '',//创建任务的jobparam

  readerColumns: [], //所有reader字段

  writerColumns: [], //所有writer	字段

  readerTableName: '',//reader表

  writerTableName: '',// writer表

  selectReaderColumn:[], // 已选中reader字段

  selectWriterColumn:[], // 已选中writer字段

  readerAllowEdit: true, // reader启用编辑

  logViewType: 0,
  
  jobInfoType: '',

  jobRule: [] // 规则
}

const mutations = {
  SET_TAB_TYPE: (state, type) => {
    state.tabType = type
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

  SET_JOBPARAM: (state,param) => {
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

  SET_SELECT_READERCOLUMN: (state,columns) => {
    state.selectReaderColumn = columns
  },

  SET_SELECT_WRITERCOLUMN: (state,columns) => {
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

  ADD_RULEITEM: (state, ruleItem) => {
    state.jobRule.push(ruleItem)
  },

  DELETE_RULEITEM: (state, ruleItemIndex) => {
    state.jobRule.splice(ruleItemIndex, 1)
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
        commit('SET_TASKDETAIL_ID', a.content.id + '');
      }
    })
  },
  addRuleItem({ commit }) {
    commit('ADD_RULEITEM', {
      columnName: '',
      ruleId: [],
      status: undefined
    })
  },
  delRuleItem({ commit }, index) {
    commit('DELETE_RULEITEM', index)
  }
}

export default {
  state,
  mutations,
  actions
}

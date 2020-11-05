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

  taskDetailID: ''// 当前选中任务详情id

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

}

export default {
  state,
  mutations,
  actions
}

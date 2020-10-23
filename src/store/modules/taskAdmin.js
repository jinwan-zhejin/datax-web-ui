const state = {
    allTabType: {
        'NORMAL': '普通任务',
        'IMPORT': '引入任务',
        'EXPORT': '导出任务',
        'SQLJOB': 'SQL任务',
        'SPARK': 'SPARK任务',
        'DQCJOB': '质量任务'
    },

    tabTypeArr: ['NORMAL','IMPORT','EXPORT','SQLJOB', 'SPARK','DQCJOB'],

    tabType: '',

    tableData: [], //新建时的表格类型

    projectId: '',//选择项目的id

    dataSourceList: [], //数据库源

    readerDataSourceID: '',//

    writerDataSourceID: '',

    taskList: [],//任务列表

    taskDetailList:[],//任务详情列表

    taskDetailID:''//当前选中任务详情id

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

    SET_TASKDETAIL_LIST:(state, list) => {
        state.taskList = list
    },

    DELETE_TASKDETAIL: (state, removeIndex) => {
        state.taskDetailList.splice(removeIndex, 1)
    },

    ADD_TASKDETAIL: (state, ele) => {
        state.taskDetailList.push(ele)
    },

    SET_TASKDETAIL_ID: (state, id) => {
        state.taskDetailID = id //设置当前选中id
    },




}

const actions = {
// addErrorLog({ commit }, log) {
//     commit('ADD_ERROR_LOG', log)
// },
}

export default {
state,
mutations,
actions
}
  
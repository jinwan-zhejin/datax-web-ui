const state = {
    allTabType: {
        'NORMAL': '普通任务',
        'IMPORT': '引入任务',
        'EXPORT': '导出任务',
        'SQLJOB': 'SQL任务',
        'SPARK': 'SPARK任务'
    },
    tabTypeArr: ['NORMAL','IMPORT','EXPORT','SQLJOB', 'SPARK'],
    tabType: '',
    tableData: [], //新建时的表格类型
    projectId: '',//选择项目的id
    dataSourceList: [], //数据库源
    readerDataSourceID: '',//
    writerDataSourceID: ''
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
  
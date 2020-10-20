const state = {
    allTabType: {
        'NORMAL': '普通任务',
        'IMPORT': '引入任务',
        'EXPORT': '导出任务',
        'SQLJOB': 'SQL任务',
    },
    tabTypeArr: ['NORMAL','IMPORT','EXPORT','SQLJOB'],
    tabType: '',
    tableData: [],
  }
  
const mutations = {
    SET_TAB_TYPE: (state, type) => {
        state.tabType = type
    },
    SET_TABLEDATA: (state, arr) => {
        state.tableData = arr
    }
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
  
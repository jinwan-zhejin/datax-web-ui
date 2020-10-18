const state = {
    allTabType: {
        'NORMAL': '普通任务',
        'IMPORT': '引入任务',
        'EXPORT': '导出任务',
        'SQLJOB': 'SQL任务',
    },
    tabTypeArr: ['NORMAL','IMPORT','EXPORT','SQLJOB'],
    tabType: ''
  }
  
const mutations = {
SET_TAB_TYPE: (state, type) => {
    state.tabType = type
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
  
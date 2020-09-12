const state = {
    codeMirrorVal: 'SELECT * from flights'
  }
  
  const mutations = {
    SET_CodeMirrorVal: (state, val) => {
      state.codeMirrorVal = val
    }
  }
  
  const actions = {
    changeMirror({ commit }, val) {
      commit('SET_CodeMirrorVal', val)
    },
    
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  
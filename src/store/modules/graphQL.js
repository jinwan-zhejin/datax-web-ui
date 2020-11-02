const state = {
  codeMirrorVal: '', // sql语句
  sqlBtnLoading: false // 执行sql语句按钮是否加载中
};

const mutations = {
  SET_CodeMirrorVal: (state, val) => {
    state.codeMirrorVal = val;
  },
  SET_SQL_BTN_STSTUS: (state, val) => {
    state.sqlBtnLoading = val;
  }
};

const actions = {
  changeMirror({ commit }, val) {
    commit('SET_CodeMirrorVal', val);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

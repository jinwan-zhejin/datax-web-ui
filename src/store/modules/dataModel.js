const state = {
    pNodeData: [], //父节点数据
  };
  
  const mutations = {
    SET_pNode_Data: (state, val) => {
      state.pNodeData = val;
    }
  };
  
  const actions = {
    setPnodeData({ commit }, val) {
      commit("SET_pNode_Data", val);
    }
  };
  
  export default {
    state,
    mutations,
    actions
  };
  
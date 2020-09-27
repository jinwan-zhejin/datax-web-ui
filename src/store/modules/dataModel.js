const state = {
  pNodeData: [] //父节点数据
};

const mutations = {
  SET_pNode_Data: (state, val) => {
    state.pNodeData = val;
  },
  ADD_ELETOPNODEDATA: (state, val) =>{
    state.pNodeData.push(val)
  }
};

const actions = {
  setPnodeData({ commit }, val) {
    commit("SET_pNode_Data", val);
  }
};

const getters = {
  allFieldsMes(state){
    let obj = {};
    if(!state.pNodeData.length){
      return {};
    };
    state.pNodeData.forEach(ele => {
      obj[ele.tableName] = ele.fields;
    });
    return obj;
  },

  allNodeFields(state){
    let arr = []
    state.pNodeData.forEach(ele => {
      // arr.push(...ele.fields);
      ele.fields.forEach(field =>{
        arr.push(ele.tableName + ' / ' + field.name);
      })
    });
    return arr
  }
}

export default {
  state,
  mutations,
  actions,
  getters
};

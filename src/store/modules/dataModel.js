const state = {
  pNodeData: [], //父节点数据

  timeField: '',//时间字段
  timeGranularity: 'second', //时间粒度
  targetList:[],//指标
  filterList:[],//过滤
  group:[],//分组
  sortField:'',//排序
  desc:false,//降序
  limit: '10',//行限制

  timeFormat: {
    'second': '%Y-%m-%dT%H:%M:%S',
    'minute': '%Y-%m-%dT%H:%M:00',
    'hour': '%Y-%m-%dT%H:00:00',
    'day': '%Y-%m-%dT00:00:00',
    'week': '%W',
    'month': '%d',
    'year': '%Y-01-01T00:00:00',
    'week_ending_saturday': 'weekday 6',
    'week_ending_sunday':`'weekday 0', '-7 days'`
  }
};

const mutations = {
  SET_pNode_Data: (state, val) => {
    state.pNodeData = val;
  },

  ADD_ELETOPNODEDATA: (state, val) =>{
    state.pNodeData.push(val)
  },

  SET_targetList: (state, val)=> {
    state.targetList = val;
  },

  SET_filterList: (state, val)=> {
    state.filterList = val
  },

  // GENERATE_SQL: (state,val) => {
  //   state.associaTionSql = val;
  // }
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
      if(ele.fields){
        ele.fields.forEach(field =>{
          arr.push(ele.tableName + '.' + field.name);
        })
      }
    });
    return arr
  },

  //生成sql
  associaTionSql(state){
    let targetStr = '';//字段
    state.targetList.forEach(ele => {
      targetStr = `${targetStr}${ele.name} AS ${ele.alias},`
    });

    let tableNameStr = '';//表名
    state.pNodeData.forEach(ele => {
      tableNameStr = `${tableNameStr}${ele.tableName} AS ${ele.tableNameCN ? ele.tableNameCN : ele.tableName},`
    })

    let filterStr = '';//过滤
    state.filterList.forEach(ele => {
      filterStr = filterStr + ele.field + ele.type + ele.filterVal + ','
    })

    let groupbyStr = '';//分组
    state.group.forEach(ele => {
      groupbyStr = groupbyStr + ele + ','
    })

    let sql = `SELECT DATETIME(STRFTIME(${state.timeFormat[state.timeGranularity]}, ${state.timeField})) AS __timestamp,
        ${targetStr} 
        FROM ${tableNameStr}
        WHERE ${filterStr}
        GROUP BY ${groupbyStr} 
        LIMIT ${state.limit}
        ORDER BY ${state.sortField} ${state.desc ? 'desc': ''}
    `;

    return sql
  }

}

export default {
  state,
  mutations,
  actions,
  getters
};

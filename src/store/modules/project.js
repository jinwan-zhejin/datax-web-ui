const state = {
  currentItem: '' // 右上角项目选择当前项
}

const mutations = {
  changeCurrent(state, payload) {
    state.currentItem = payload
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}

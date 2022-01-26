const state = {
  routeName: null,
  routefullPath: null,
};
const getters = {
  routeName: (state) => state.routeName,
  routefullPath: (state) => state.routefullPath,
};
const mutations = {
  setRouteName(state, route) {
    state.routeName = route.name;
    state.routefullPath = route.fullPath;
  },
};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};

import { setItem } from "@/assets/js/utils";

const state = {
  token: "",
  userInfo: {},
};
const getters = {
  token: (state) => state.token,
  userInfo: (state) => state.userInfo,
};
const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
};
const actions = {
  logout(context) {
    setItem("token", null);
    setItem("user", null);
    context.commit("setUserInfo", null);
    context.commit("setToken", null);
    // router.push('/login')
    window.location.href = window.location.href.split("/")[0] + "/login";
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
